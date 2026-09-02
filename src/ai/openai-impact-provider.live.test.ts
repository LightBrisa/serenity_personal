import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { impactAnalysisResultSchema } from './impact-analysis';
import { createImpactPostHandler } from './impact-route';
import { validImpactInput } from './impact-test-fixtures';

const liveEnabled = process.env.RUN_MODEL_SMOKE === '1' && Boolean(process.env.OPENAI_API_KEY?.trim());
const liveIt = liveEnabled ? it : it.skip;

liveIt('真实 OpenAI Responses API 穿过 HTTP 边界并返回通过校验的影响分析', async () => {
  const response = await createImpactPostHandler()(new Request('http://localhost/api/ai/impact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validImpactInput),
  }));

  expect(response.status).toBe(200);
  expect(response.headers.get('Cache-Control')).toBe('no-store');
  const result = impactAnalysisResultSchema.parse(await response.json());

  expect(result.meta.provider).toBe('openai');
  expect(result.meta.analysisRunId).toMatch(/^resp_/);
  expect(result.analysis.affectedAssumptions.every((item) => (
    validImpactInput.assumptions.some((assumption) => assumption.id === item.id)
  ))).toBe(true);

  const impactSourcePath = fileURLToPath(new URL('./impact-analysis.ts', import.meta.url));
  const reportDir = path.join(process.cwd(), 'work', 'verification');
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(path.join(reportDir, 'live-model-smoke.json'), JSON.stringify({
    schemaVersion: 1,
    status: 'VERIFIED',
    verifiedAt: new Date().toISOString(),
    gitHead: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    model: result.meta.model,
    promptVersion: result.meta.promptVersion,
    impactSchemaSha256: createHash('sha256').update(readFileSync(impactSourcePath)).digest('hex').toUpperCase(),
    inputHash: result.meta.inputHash,
    analysisRunId: result.meta.analysisRunId,
  }, null, 2), 'utf8');
}, 40_000);
