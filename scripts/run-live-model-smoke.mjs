import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { isLiveModelSmokeRequested, nodeChildEnvironment } from './node-env-proxy.mjs';

const liveRequested = isLiveModelSmokeRequested();
const localEnvPath = path.join(process.cwd(), '.env.local');
if (existsSync(localEnvPath)) {
  try {
    loadEnvFile(localEnvPath);
  } catch {
    console.error('Unable to load the local environment file.');
    process.exit(2);
  }
}

if (!liveRequested || !process.env.OPENAI_API_KEY?.trim()) {
  console.error('Live model smoke was NOT RUN. Set RUN_MODEL_SMOKE=1 and OPENAI_API_KEY first.');
  process.exit(2);
}

const gitHead = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const gitStatus = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' });
if (gitStatus.trim()) {
  console.error('Live model smoke requires a clean Git worktree so its report can be tied to one revision.');
  process.exit(2);
}

const reportPath = path.join(process.cwd(), 'work', 'verification', 'live-model-smoke.json');
if (existsSync(reportPath)) rmSync(reportPath);

const vitestEntry = path.join(process.cwd(), 'node_modules', 'vitest', 'vitest.mjs');
const result = spawnSync(process.execPath, [
  vitestEntry,
  'run',
  'src/ai/openai-impact-provider.live.test.ts',
  '--config',
  'vitest.live.config.ts',
], {
  env: nodeChildEnvironment(),
  stdio: 'inherit',
});

if (result.status !== 0) process.exit(result.status ?? 1);
if (!existsSync(reportPath)) {
  console.error('Live model test passed without producing its verification report.');
  process.exit(1);
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'));
if (report.status !== 'VERIFIED' || report.gitHead !== gitHead) {
  console.error('Live model report does not match the current Git revision.');
  process.exit(1);
}

console.log(`LIVE_MODEL_REPORT=${reportPath}`);
