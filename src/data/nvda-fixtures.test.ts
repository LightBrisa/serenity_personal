import { describe, expect, it } from 'vitest';
import { ideaBreakdownSchema } from '@/src/domain/schemas';
import {
  fixtureMeta,
  nvdaAssumptionsById,
  nvdaEvidence,
  nvdaIdeaBreakdown,
  nvdaResearchRun,
  nvdaSourcesById,
  nvdaThesisVersions,
} from './nvda-fixtures';

describe('NVDA 演示数据完整性', () => {
  it('符合 IdeaBreakdown 结构化数据约定', () => {
    expect(ideaBreakdownSchema.safeParse(nvdaIdeaBreakdown).success).toBe(true);
  });

  it('每条证据都能找到对应的来源和假设', () => {
    for (const item of nvdaEvidence) {
      expect(nvdaSourcesById[item.sourceId], `${item.id} 对应的来源`).toBeDefined();
      for (const assumptionId of item.assumptionIds) {
        expect(nvdaAssumptionsById[assumptionId], `${item.id} 对应的假设`).toBeDefined();
      }
    }
  });

  it('防止初次研究混入当时尚未公开的数据', () => {
    for (const evidenceId of nvdaResearchRun.evidenceIds) {
      const item = nvdaEvidence.find((entry) => entry.id === evidenceId)!;
      const source = nvdaSourcesById[item.sourceId];
      expect(new Date(source.availableAt).getTime()).toBeLessThanOrEqual(new Date(fixtureMeta.researchAsOf).getTime());
    }
    expect(nvdaResearchRun.evidenceIds).not.toContain('ev-h20-license');
  });

  it('以只追加方式保留论点历史', () => {
    expect(nvdaThesisVersions.map((version) => version.version)).toEqual([1, 2]);
    expect(nvdaThesisVersions[0].state).toBe('STABLE');
    expect(nvdaThesisVersions[1].state).toBe('WATCH');
  });
});
