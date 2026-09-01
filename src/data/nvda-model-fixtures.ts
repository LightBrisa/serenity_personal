import type { GeneratedImpactAnalysis } from '@/src/ai/impact-analysis';

/**
 * Regression fixture for offline demos. It is never presented as a live model run.
 * The online route always returns a newly validated provider result instead.
 */
export const nvdaH20OfflineAnalysis: GeneratedImpactAnalysis = {
  relation: 'CHALLENGES',
  materiality: 'HIGH',
  explanation: '这项变化把已知的监管风险转化为立即生效的产品限制和预计财务费用。它可能削弱市场准入和短期盈利能力前提，但仅凭这一点，还不能说明全球 AI 需求或 Blackwell 采用趋势已经逆转。',
  affectedAssumptions: [
    {
      id: 'assumption-access',
      effect: 'WEAKENS',
      rationale: '许可要求直接改变了 H20 向相关目的地出口的条件，可触达市场因此面临更明确的限制。',
    },
    {
      id: 'assumption-margin',
      effect: 'WEAKENS',
      rationale: '最高约 55 亿美元的预计费用会增加近期盈利能力压力，但实际金额尚未确定。',
    },
  ],
  evidenceGaps: [
    'H20 许可最终是否获得，以及可以恢复多少收入。',
    '55 亿美元预计费用与实际费用会相差多少。',
    '中国以外客户的需求能否抵消这项影响。',
  ],
  limitations: [
    '来源披露的是预计费用，不能单独证明长期需求已经改变。',
    '这份历史快照没有包含许可结果、实际费用或后续客户需求数据。',
  ],
};
