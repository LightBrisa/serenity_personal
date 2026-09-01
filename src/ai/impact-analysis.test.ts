import { describe, expect, it } from 'vitest';
import {
  analyzeImpact,
  ModelCapabilityError,
} from './impact-analysis';
import { fakeProvider, validGeneratedImpact, validImpactInput } from './impact-test-fixtures';

describe('模型影响分析边界', () => {
  it('接受合格结构并补充可审计元数据', async () => {
    const result = await analyzeImpact(validImpactInput, fakeProvider());

    expect(result.analysis).toEqual(validGeneratedImpact);
    expect(result.meta).toMatchObject({
      analysisRunId: 'resp_test_123',
      sourceIds: ['src-h20-8k'],
      thesisVersionId: 'thesis-nvda-v1',
    });
    expect(result.meta.inputHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('拒绝模型创造本次输入之外的前提 ID', async () => {
    const badOutput = {
      ...validGeneratedImpact,
      affectedAssumptions: [{
        id: 'assumption-invented',
        effect: 'WEAKENS' as const,
        rationale: '这是模型自行创造的前提，不能进入可信记录。',
      }],
    };

    await expect(analyzeImpact(validImpactInput, fakeProvider(badOutput))).rejects.toMatchObject({
      code: 'MODEL_INVALID_OUTPUT',
    } satisfies Partial<ModelCapabilityError>);
  });

  it('拒绝重复引用同一个前提', async () => {
    const duplicateOutput = {
      ...validGeneratedImpact,
      affectedAssumptions: [
        validGeneratedImpact.affectedAssumptions[0],
        validGeneratedImpact.affectedAssumptions[0],
      ],
    };

    await expect(analyzeImpact(validImpactInput, fakeProvider(duplicateOutput))).rejects.toMatchObject({
      code: 'MODEL_INVALID_OUTPUT',
    });
  });

  it('拒绝未知请求字段和过短事实', async () => {
    await expect(analyzeImpact({
      ...validImpactInput,
      unexpected: 'ignored-not-allowed',
    }, fakeProvider())).rejects.toBeTruthy();

    await expect(analyzeImpact({
      ...validImpactInput,
      source: { ...validImpactInput.source, rawFact: '太短' },
    }, fakeProvider())).rejects.toBeTruthy();
  });

  it('区分回溯 fixture 与当时可获得的来源时间边界', async () => {
    await expect(analyzeImpact({
      ...validImpactInput,
      provenanceMode: 'CONTEMPORANEOUS',
    }, fakeProvider())).rejects.toBeTruthy();

    await expect(analyzeImpact({
      ...validImpactInput,
      source: {
        ...validImpactInput.source,
        availableAt: '2025-04-17T00:00:00.000Z',
      },
    }, fakeProvider())).rejects.toBeTruthy();

    await expect(analyzeImpact({
      ...validImpactInput,
      source: {
        ...validImpactInput.source,
        retrievedAt: '2025-04-14T00:00:00.000Z',
      },
    }, fakeProvider())).rejects.toBeTruthy();
  });

  it('允许中性分析诚实返回空命中和空缺口', async () => {
    const neutral = {
      ...validGeneratedImpact,
      relation: 'NEUTRAL' as const,
      materiality: 'LOW' as const,
      affectedAssumptions: [],
      evidenceGaps: [],
    };

    await expect(analyzeImpact(validImpactInput, fakeProvider(neutral))).resolves.toMatchObject({
      analysis: neutral,
    });
  });

  it('拒绝输入中重复的前提 ID', async () => {
    await expect(analyzeImpact({
      ...validImpactInput,
      assumptions: [
        validImpactInput.assumptions[0],
        { ...validImpactInput.assumptions[1], id: validImpactInput.assumptions[0].id },
      ],
    }, fakeProvider())).rejects.toBeTruthy();
  });
});
