import type { EvidenceAssessment, EvidenceRelation } from './types';

export function percentChange(start: number, end: number): number {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start === 0) {
    throw new Error('百分比变化要求起点和终点都是有限数值，且起点不能为 0。');
  }
  return ((end - start) / Math.abs(start)) * 100;
}

export function simpleMovingAverage(values: number[], window: number): number[] {
  if (!Number.isInteger(window) || window <= 0) {
    throw new Error('移动平均窗口必须是正整数。');
  }
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error('移动平均输入必须都是有限数值。');
  }
  if (window > values.length) return [];

  return values.slice(window - 1).map((_, index) => {
    const offset = index;
    const sample = values.slice(offset, offset + window);
    return sample.reduce((total, value) => total + value, 0) / window;
  });
}

export function relationCounts(evidence: EvidenceAssessment[]): Record<EvidenceRelation, number> {
  return evidence.reduce<Record<EvidenceRelation, number>>(
    (counts, item) => {
      counts[item.relation] += 1;
      return counts;
    },
    { SUPPORTS: 0, CHALLENGES: 0, NEUTRAL: 0 },
  );
}
