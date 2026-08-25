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

describe('NVDA demo fixture integrity', () => {
  it('matches the structured IdeaBreakdown contract', () => {
    expect(ideaBreakdownSchema.safeParse(nvdaIdeaBreakdown).success).toBe(true);
  });

  it('resolves every evidence source and assumption reference', () => {
    for (const item of nvdaEvidence) {
      expect(nvdaSourcesById[item.sourceId], `${item.id} source`).toBeDefined();
      for (const assumptionId of item.assumptionIds) {
        expect(nvdaAssumptionsById[assumptionId], `${item.id} assumption`).toBeDefined();
      }
    }
  });

  it('prevents future-data leakage into the initial research run', () => {
    for (const evidenceId of nvdaResearchRun.evidenceIds) {
      const item = nvdaEvidence.find((entry) => entry.id === evidenceId)!;
      const source = nvdaSourcesById[item.sourceId];
      expect(new Date(source.availableAt).getTime()).toBeLessThanOrEqual(new Date(fixtureMeta.researchAsOf).getTime());
    }
    expect(nvdaResearchRun.evidenceIds).not.toContain('ev-h20-license');
  });

  it('preserves append-only thesis history', () => {
    expect(nvdaThesisVersions.map((version) => version.version)).toEqual([1, 2]);
    expect(nvdaThesisVersions[0].state).toBe('STABLE');
    expect(nvdaThesisVersions[1].state).toBe('WATCH');
  });
});
