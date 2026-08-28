export type DecisionChoice = 'KEEP' | 'WATCH' | 'GATHER' | 'INVALIDATE';

export interface DecisionOutcome {
  stateAfter: 'STABLE' | 'WATCH' | 'INVALIDATED' | null;
  taskStatus: 'RESOLVED' | 'GATHERING';
  thesisStatus: 'ACTIVE' | 'INVALIDATED';
}

export function getDecisionOutcome(choice: DecisionChoice): DecisionOutcome {
  switch (choice) {
    case 'KEEP':
      return { stateAfter: 'STABLE', taskStatus: 'RESOLVED', thesisStatus: 'ACTIVE' };
    case 'WATCH':
      return { stateAfter: 'WATCH', taskStatus: 'RESOLVED', thesisStatus: 'ACTIVE' };
    case 'GATHER':
      return { stateAfter: null, taskStatus: 'GATHERING', thesisStatus: 'ACTIVE' };
    case 'INVALIDATE':
      return { stateAfter: 'INVALIDATED', taskStatus: 'RESOLVED', thesisStatus: 'INVALIDATED' };
  }
}
