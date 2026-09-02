import { describe, expect, it } from 'vitest';
import {
  hasConfiguredProxy,
  isLiveModelSmokeRequested,
  nodeChildEnvironment,
} from './node-env-proxy.mjs';

describe('Node 子进程代理环境', () => {
  it('没有代理配置时不启用 Node 环境代理', () => {
    const input = { PATH: 'test-path' };
    const output = nodeChildEnvironment(input, true);

    expect(output).toEqual(input);
    expect(output).not.toBe(input);
  });

  it('识别并规范化小写代理变量，在运行时支持时启用环境代理', () => {
    expect(hasConfiguredProxy({ https_proxy: 'http://proxy.invalid:8080' })).toBe(true);

    const input = {
      https_proxy: 'http://proxy.invalid:8080',
      no_proxy: 'localhost,127.0.0.1',
    };
    const output = nodeChildEnvironment(input, true);

    expect(output.NODE_USE_ENV_PROXY).toBe('1');
    expect(output.HTTPS_PROXY).toBe(input.https_proxy);
    expect(output.NO_PROXY).toBe(input.no_proxy);
    expect(input).not.toHaveProperty('NODE_USE_ENV_PROXY');
  });

  it('ALL_PROXY 单独存在时不声称 Node 内置代理可用', () => {
    expect(hasConfiguredProxy({ ALL_PROXY: 'socks://proxy.invalid:1080' })).toBe(false);
    expect(nodeChildEnvironment({ ALL_PROXY: 'socks://proxy.invalid:1080' }, true))
      .not.toHaveProperty('NODE_USE_ENV_PROXY');
  });

  it('运行时不支持该能力时保持兼容，并尊重显式关闭', () => {
    expect(nodeChildEnvironment({ HTTPS_PROXY: 'http://proxy.invalid:8080' }, false))
      .not.toHaveProperty('NODE_USE_ENV_PROXY');
    expect(nodeChildEnvironment({
      HTTPS_PROXY: 'http://proxy.invalid:8080',
      NODE_USE_ENV_PROXY: '0',
    }, true).NODE_USE_ENV_PROXY).toBe('0');
  });

  it('真实 smoke 只接受调用进程明确给出的严格门槛值', () => {
    expect(isLiveModelSmokeRequested({ RUN_MODEL_SMOKE: '1' })).toBe(true);
    expect(isLiveModelSmokeRequested({ RUN_MODEL_SMOKE: 'true' })).toBe(false);
    expect(isLiveModelSmokeRequested({})).toBe(false);
  });
});
