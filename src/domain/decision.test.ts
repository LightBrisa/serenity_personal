import { describe, expect, it } from 'vitest';
import { getDecisionOutcome } from './decision';

describe('用户判断选择的产品语义', () => {
  it('先补证据保持为未完成任务，并保留原判断', () => {
    expect(getDecisionOutcome('GATHER')).toEqual({
      stateAfter: null,
      taskStatus: 'GATHERING',
      thesisStatus: 'ACTIVE',
    });
  });

  it('判断已不成立会结束任务，并停止沿用原判断', () => {
    expect(getDecisionOutcome('INVALIDATE')).toEqual({
      stateAfter: 'INVALIDATED',
      taskStatus: 'RESOLVED',
      thesisStatus: 'INVALIDATED',
    });
  });

  it('维持与重看都形成已完成的当前判断', () => {
    expect(getDecisionOutcome('KEEP')).toMatchObject({ stateAfter: 'STABLE', taskStatus: 'RESOLVED' });
    expect(getDecisionOutcome('WATCH')).toMatchObject({ stateAfter: 'WATCH', taskStatus: 'RESOLVED' });
  });
});
