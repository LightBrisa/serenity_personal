import { describe, expect, it } from 'vitest';
import {
  APIUserAbortError,
  AuthenticationError,
  InternalServerError,
  RateLimitError,
} from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { generatedImpactAnalysisSchema } from './impact-analysis';
import {
  createOpenAIImpactProvider,
  type OpenAIImpactClient,
  type OpenAIImpactRequest,
  type OpenAIImpactResponse,
} from './openai-impact-provider';
import { validGeneratedImpact, validImpactInput } from './impact-test-fixtures';

function completedResponse(overrides: Partial<OpenAIImpactResponse> = {}): OpenAIImpactResponse {
  return {
    id: 'resp_openai_test',
    model: 'gpt-5.6-luna',
    created_at: 1_788_220_800,
    status: 'completed',
    output: [],
    output_parsed: validGeneratedImpact,
    ...overrides,
  };
}

function clientReturning(value: OpenAIImpactResponse | Error): OpenAIImpactClient {
  return {
    responses: {
      async parse() {
        if (value instanceof Error) throw value;
        return value;
      },
    },
  };
}

describe('OpenAI 模型适配器', () => {
  it('缺少或只有空白 API Key 时直接失败，不发网络请求', () => {
    expect(() => createOpenAIImpactProvider({})).toThrowError(/OPENAI_API_KEY/);
    expect(() => createOpenAIImpactProvider({ OPENAI_API_KEY: '   ' })).toThrowError(/OPENAI_API_KEY/);
  });

  it('Structured Outputs schema 可以被 SDK 构造且不含 optional 字段', () => {
    expect(() => zodTextFormat(generatedImpactAnalysisSchema, 'serenity_impact_analysis')).not.toThrow();
  });

  it('向 Responses API 发送隐私和时限约束，并读取 output_parsed', async () => {
    let body: OpenAIImpactRequest | undefined;
    let signal: AbortSignal | null | undefined;
    const client: OpenAIImpactClient = {
      responses: {
        async parse(receivedBody, options) {
          body = receivedBody;
          signal = options?.signal;
          return completedResponse();
        },
      },
    };
    const provider = createOpenAIImpactProvider({
      OPENAI_API_KEY: 'test-key-not-real',
      OPENAI_MODEL: 'gpt-5.6-luna',
    }, { client });

    const result = await provider.analyze(validImpactInput);

    expect(body).toMatchObject({
      model: 'gpt-5.6-luna',
      store: false,
      reasoning: { effort: 'low' },
      max_output_tokens: 1_400,
    });
    expect(String(body?.instructions)).toContain('不要替用户选择判断状态');
    expect(body?.input).toBe(JSON.stringify(validImpactInput));
    expect(body?.text).toBeTruthy();
    expect(signal).toBeInstanceOf(AbortSignal);
    expect(result).toMatchObject({
      analysis: validGeneratedImpact,
      analysisRunId: 'resp_openai_test',
      provider: 'openai',
      model: 'gpt-5.6-luna',
    });
  });

  it('拒绝 refusal、incomplete 和空的结构化结果', async () => {
    const cases: Array<[OpenAIImpactResponse, string]> = [
      [completedResponse({
        output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'cannot comply' }] }],
        output_parsed: null,
      }), 'MODEL_REFUSED'],
      [completedResponse({ status: 'incomplete' }), 'MODEL_INCOMPLETE'],
      [completedResponse({ output_parsed: null }), 'MODEL_INVALID_OUTPUT'],
    ];

    for (const [response, code] of cases) {
      const provider = createOpenAIImpactProvider({ OPENAI_API_KEY: 'test-key-not-real' }, {
        client: clientReturning(response),
      });
      await expect(provider.analyze(validImpactInput)).rejects.toMatchObject({ code });
    }
  });

  it('稳定映射中止、鉴权、限流和服务端错误', async () => {
    const cases: Array<[Error, string, number]> = [
      [new SyntaxError('invalid structured output'), 'MODEL_INVALID_OUTPUT', 502],
      [new APIUserAbortError(), 'MODEL_TIMEOUT', 504],
      [new AuthenticationError(401, {}, 'bad credential', new Headers()), 'MODEL_NOT_CONFIGURED', 503],
      [new RateLimitError(429, {}, 'slow down', new Headers()), 'MODEL_RATE_LIMITED', 429],
      [new InternalServerError(500, {}, 'provider internals', new Headers()), 'MODEL_UPSTREAM_ERROR', 502],
    ];

    for (const [error, code, httpStatus] of cases) {
      const provider = createOpenAIImpactProvider({ OPENAI_API_KEY: 'test-key-not-real' }, {
        client: clientReturning(error),
      });
      await expect(provider.analyze(validImpactInput)).rejects.toMatchObject({ code, httpStatus });
    }
  });
});
