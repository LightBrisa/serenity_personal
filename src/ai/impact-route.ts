import { ZodError } from 'zod';
import {
  analyzeImpact,
  impactAnalysisInputSchema,
  ModelCapabilityError,
  type ImpactAnalysisProvider,
} from './impact-analysis';
import { createOpenAIImpactProvider } from './openai-impact-provider';

interface ImpactRouteDependencies {
  providerFactory?: () => ImpactAnalysisProvider;
}

const responseHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};

const MAX_REQUEST_BYTES = 16 * 1_024;

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

async function readBoundedBody(request: Request) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }

  return text + decoder.decode();
}

export function createImpactPostHandler({
  providerFactory = createOpenAIImpactProvider,
}: ImpactRouteDependencies = {}) {
  return async function POST(request: Request) {
    try {
      const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() || '';
      if (contentType !== 'application/json') {
        return jsonResponse({
          error: {
            code: 'UNSUPPORTED_MEDIA_TYPE',
            message: '请使用 application/json 提交请求。',
          },
        }, 415);
      }

      const declaredLength = Number(request.headers.get('content-length'));
      if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
        return jsonResponse({
          error: {
            code: 'REQUEST_TOO_LARGE',
            message: '请求内容过长。',
          },
        }, 413);
      }

      const rawBody = await readBoundedBody(request);
      if (rawBody === null) {
        return jsonResponse({
          error: {
            code: 'REQUEST_TOO_LARGE',
            message: '请求内容过长。',
          },
        }, 413);
      }

      const body = JSON.parse(rawBody) as unknown;
      const input = impactAnalysisInputSchema.parse(body);
      const result = await analyzeImpact(input, providerFactory());
      return jsonResponse(result, 200);
    } catch (error) {
      if (error instanceof SyntaxError || error instanceof ZodError) {
        return jsonResponse({
          error: {
            code: 'INVALID_REQUEST',
            message: '请求内容不完整或格式不正确。',
          },
        }, 400);
      }

      if (error instanceof ModelCapabilityError) {
        return jsonResponse({
          error: {
            code: error.code,
            message: error.message,
          },
        }, error.httpStatus);
      }

      console.error('[impact-analysis] unexpected route failure', {
        name: error instanceof Error ? error.name : 'UnknownError',
      });
      return jsonResponse({
        error: {
          code: 'INTERNAL_ERROR',
          message: '服务暂时无法完成这次整理。',
        },
      }, 500);
    }
  };
}
