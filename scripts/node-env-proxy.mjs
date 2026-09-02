const PROXY_ENV_PAIRS = [
  ['HTTPS_PROXY', 'https_proxy'],
  ['HTTP_PROXY', 'http_proxy'],
];

function nonBlank(value) {
  return typeof value === 'string' && value.trim() !== '';
}

export function hasConfiguredProxy(env = process.env) {
  return PROXY_ENV_PAIRS.some(([upper, lower]) => nonBlank(env[upper]) || nonBlank(env[lower]));
}

export function isLiveModelSmokeRequested(env = process.env) {
  return env.RUN_MODEL_SMOKE === '1';
}

function currentNodeSupportsEnvProxy() {
  return Number.parseInt(process.versions.node.split('.', 1)[0], 10) >= 24;
}

export function nodeChildEnvironment(
  env = process.env,
  supportsEnvProxy = currentNodeSupportsEnvProxy(),
) {
  const childEnv = { ...env };

  if (!hasConfiguredProxy(childEnv) || !supportsEnvProxy) return childEnv;

  for (const [upper, lower] of [...PROXY_ENV_PAIRS, ['NO_PROXY', 'no_proxy']]) {
    if (!nonBlank(childEnv[upper]) && nonBlank(childEnv[lower])) childEnv[upper] = childEnv[lower];
  }

  if (typeof childEnv.NODE_USE_ENV_PROXY !== 'string' || childEnv.NODE_USE_ENV_PROXY.trim() === '') {
    childEnv.NODE_USE_ENV_PROXY = '1';
  }

  return childEnv;
}
