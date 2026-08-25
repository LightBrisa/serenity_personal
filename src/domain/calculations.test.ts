import { describe, expect, it } from 'vitest';
import { percentChange, relationCounts, simpleMovingAverage } from './calculations';
import type { EvidenceAssessment } from './types';

describe('deterministic financial calculations', () => {
  it('calculates percentage change from explicit inputs', () => {
    expect(percentChange(100, 125)).toBe(25);
    expect(percentChange(80, 60)).toBe(-25);
  });

  it('rejects an invalid percentage-change baseline', () => {
    expect(() => percentChange(0, 10)).toThrow(/non-zero start/);
  });

  it('calculates a rolling simple moving average', () => {
    expect(simpleMovingAverage([10, 20, 30, 40], 3)).toEqual([20, 30]);
  });

  it('counts evidence relations without inventing a score', () => {
    const base = {
      sourceId: 'source',
      title: 'Evidence',
      layer: 'FUNDAMENTALS',
      confidence: 'HIGH',
      assumptionIds: ['assumption'],
      interpretation: 'Interpretation',
      limitations: 'Limitations',
      assessedAt: '2025-02-27T00:00:00.000Z',
    } satisfies Omit<EvidenceAssessment, 'id' | 'relation'>;
    const evidence: EvidenceAssessment[] = [
      { ...base, id: '1', relation: 'SUPPORTS' },
      { ...base, id: '2', relation: 'SUPPORTS' },
      { ...base, id: '3', relation: 'CHALLENGES' },
    ];

    expect(relationCounts(evidence)).toEqual({ SUPPORTS: 2, CHALLENGES: 1, NEUTRAL: 0 });
  });
});
