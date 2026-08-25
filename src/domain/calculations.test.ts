import { describe, expect, it } from 'vitest';
import { percentChange, relationCounts, simpleMovingAverage } from './calculations';
import type { EvidenceAssessment } from './types';

describe('确定性金融计算', () => {
  it('根据明确的输入计算百分比变化', () => {
    expect(percentChange(100, 125)).toBe(25);
    expect(percentChange(80, 60)).toBe(-25);
  });

  it('拒绝无效的百分比变化起点', () => {
    expect(() => percentChange(0, 10)).toThrow(/起点不能为 0/);
  });

  it('计算滚动简单移动平均', () => {
    expect(simpleMovingAverage([10, 20, 30, 40], 3)).toEqual([20, 30]);
  });

  it('只统计证据关系，不凭空生成分数', () => {
    const base = {
      sourceId: 'source',
      title: '证据',
      layer: 'FUNDAMENTALS',
      confidence: 'HIGH',
      assumptionIds: ['assumption'],
      interpretation: '研究解读',
      limitations: '局限',
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
