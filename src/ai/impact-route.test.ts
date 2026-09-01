import { describe, expect, it, vi } from 'vitest';
import { ModelCapabilityError } from './impact-analysis';
import { createImpactPostHandler } from './impact-route';
import { fakeProvider, validImpactInput } from './impact-test-fixtures';

function jsonRequest(body: unknown, contentType = 'application/json') {
  return new Request('http://localhost/api/ai/impact', {
    method: 'POST',
    headers: { 'content-type': contentType },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('模型影响分析 HTTP 边界', () => {
  it('返回结构化结果且禁止缓存', async () => {
    const handler = createImpactPostHandler({ providerFactory: () => fakeProvider() });
    const response = await handler(jsonRequest(validImpactInput));
    const body = await response.json() as {
      meta: { analysisRunId: string };
      analysis: { relation: string };
    };

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(body.meta.analysisRunId).toBe('resp_test_123');
    expect(body.analysis.relation).toBe('CHALLENGES');
  });

  it('在解析请求前不会构造或调用供应商', async () => {
    const providerFactory = vi.fn(() => fakeProvider());
    const handler = createImpactPostHandler({ providerFactory });
    const response = await handler(jsonRequest('{broken-json'));

    expect(response.status).toBe(400);
    expect(providerFactory).not.toHaveBeenCalled();
  });

  it('拒绝非 JSON 请求', async () => {
    const handler = createImpactPostHandler({ providerFactory: () => fakeProvider() });
    const response = await handler(jsonRequest('plain text', 'text/plain'));
    expect(response.status).toBe(415);
    expect(((await response.json()) as { error: { code: string } }).error.code).toBe('UNSUPPORTED_MEDIA_TYPE');
  });

  it('拒绝超过 16 KiB 的请求，即使没有 Content-Length', async () => {
    const handler = createImpactPostHandler({ providerFactory: () => fakeProvider() });
    const response = await handler(jsonRequest(JSON.stringify({ value: 'x'.repeat(17_000) })));
    expect(response.status).toBe(413);
    expect(((await response.json()) as { error: { code: string } }).error.code).toBe('REQUEST_TOO_LARGE');
  });

  it('把未配置凭据映射为明确的 503', async () => {
    const handler = createImpactPostHandler({
      providerFactory: () => {
        throw new ModelCapabilityError('MODEL_NOT_CONFIGURED', 503, '服务器尚未配置 OPENAI_API_KEY。');
      },
    });
    const response = await handler(jsonRequest(validImpactInput));
    const body = await response.json() as { error: { code: string; message: string } };

    expect(response.status).toBe(503);
    expect(body).toEqual({
      error: {
        code: 'MODEL_NOT_CONFIGURED',
        message: '服务器尚未配置 OPENAI_API_KEY。',
      },
    });
  });

  it('稳定映射超时且不泄露上游错误正文', async () => {
    const secretLikeUpstreamMessage = 'request failed with provider-secret-sentinel';
    const provider = fakeProvider();
    provider.analyze = async () => {
      throw new ModelCapabilityError('MODEL_TIMEOUT', 504, '模型调用超时。', {
        cause: new Error(secretLikeUpstreamMessage),
      });
    };
    const handler = createImpactPostHandler({ providerFactory: () => provider });
    const response = await handler(jsonRequest(validImpactInput));
    const text = await response.text();

    expect(response.status).toBe(504);
    expect(text).toContain('MODEL_TIMEOUT');
    expect(text).not.toContain('provider-secret-sentinel');
  });
});
