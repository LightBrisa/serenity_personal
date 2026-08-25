import type { EvidenceAssessment, EvidenceRelation } from './types';

export function percentChange(start: number, end: number): number {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start === 0) {
    throw new Error('Percent change requires finite values and a non-zero start.');
  }
  return ((end - start) / Math.abs(start)) * 100;
}

export function simpleMovingAverage(values: number[], window: number): number[] {
  if (!Number.isInteger(window) || window <= 0) {
    throw new Error('Moving-average window must be a positive integer.');
  }
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error('Moving-average inputs must be finite.');
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
