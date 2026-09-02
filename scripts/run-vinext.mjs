import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { nodeChildEnvironment } from './node-env-proxy.mjs';

const [command, ...args] = process.argv.slice(2);
if (!['dev', 'start'].includes(command)) {
  console.error('Usage: node scripts/run-vinext.mjs <dev|start> [...args]');
  process.exit(2);
}

const vinextCli = fileURLToPath(new URL('../node_modules/vinext/dist/cli.js', import.meta.url));
if (!existsSync(vinextCli)) {
  console.error('vinext CLI is unavailable. Run npm install first.');
  process.exit(2);
}

const result = spawnSync(process.execPath, [vinextCli, command, ...args], {
  cwd: process.cwd(),
  env: nodeChildEnvironment(),
  stdio: 'inherit',
});

if (result.error) {
  console.error('Unable to start the local Vinext process.');
  process.exit(1);
}

process.exit(result.status ?? 1);
