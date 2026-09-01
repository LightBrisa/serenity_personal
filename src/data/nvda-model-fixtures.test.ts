import { describe, expect, it } from 'vitest';
import { generatedImpactAnalysisSchema } from '@/src/ai/impact-analysis';
import { nvdaAssumptionsById } from './nvda-fixtures';
import { nvdaH20OfflineAnalysis } from './nvda-model-fixtures';

describe('NVDA 离线模型回归样例', () => {
  it('遵守与在线模型相同的结构化输出合同', () => {
    expect(generatedImpactAnalysisSchema.parse(nvdaH20OfflineAnalysis)).toEqual(nvdaH20OfflineAnalysis);
  });

  it('只引用真实存在的前提，不携带用户判断', () => {
    expect(nvdaH20OfflineAnalysis.affectedAssumptions.every(({ id }) => Boolean(nvdaAssumptionsById[id]))).toBe(true);
    expect('choice' in nvdaH20OfflineAnalysis).toBe(false);
    expect('stateAfter' in nvdaH20OfflineAnalysis).toBe(false);
  });
});
