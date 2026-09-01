import type { ImpactAnalysisInput, ImpactAnalysisProvider } from './impact-analysis';

export const validImpactInput: ImpactAnalysisInput = {
  provenanceMode: 'RETROSPECTIVE_FIXTURE',
  analysisAsOf: '2025-04-16T12:00:00.000Z',
  thesis: {
    id: 'thesis-nvda-v1',
    ticker: 'NVDA',
    coreThesis: '如果需求、产品放量、利润率和市场准入能够维持，未来十二到十八个月业务仍可能增长。',
    horizon: '12–18 个月',
  },
  source: {
    id: 'src-h20-8k',
    title: 'NVIDIA Form 8-K · H20 出口许可要求',
    publisher: 'NVIDIA / 美国 SEC',
    publishedAt: '2025-04-15T21:22:59.000Z',
    availableAt: '2025-04-15T21:22:59.000Z',
    retrievedAt: '2026-08-25T06:00:00.000Z',
    rawFact: 'NVIDIA 披露，向中国及相关目的地出口 H20 必须取得许可，并预计产生最高约 55 亿美元相关费用。',
  },
  assumptions: [
    { id: 'assumption-access', statement: '出口限制不会显著压缩可以覆盖的市场。' },
    { id: 'assumption-margin', statement: '产品放量后毛利率能够企稳。' },
  ],
};

export const validGeneratedImpact = {
  relation: 'CHALLENGES' as const,
  materiality: 'HIGH' as const,
  explanation: '来源事实显示许可要求和预计费用已经出现，可能同时影响市场准入和短期利润率前提。',
  affectedAssumptions: [
    {
      id: 'assumption-access',
      effect: 'WEAKENS' as const,
      rationale: '许可要求直接限制了相关产品进入所述目的地的条件。',
    },
    {
      id: 'assumption-margin',
      effect: 'WEAKENS' as const,
      rationale: '预计费用可能增加近期盈利能力承受的压力。',
    },
  ],
  evidenceGaps: ['许可最终是否获批，以及相关收入可以恢复多少。'],
  limitations: ['这份来源只披露预计费用，不能单独证明长期需求已经改变。'],
};

export function fakeProvider(analysis: unknown = validGeneratedImpact): ImpactAnalysisProvider {
  return {
    async analyze() {
      return {
        analysis,
        analysisRunId: 'resp_test_123',
        provider: 'fake-openai',
        model: 'gpt-test',
        promptVersion: 'impact-analysis-v1',
        generatedAt: '2026-09-01T00:00:00.000Z',
      };
    },
  };
}
