export type ISODateTime = string;

export type Ticker = string;

export type ResearchLayer = 'FUNDAMENTALS' | 'INFORMATION' | 'MARKET';

export type EvidenceRelation = 'SUPPORTS' | 'CHALLENGES' | 'NEUTRAL';

export type EvidenceConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export type ThesisState = 'STRONG' | 'STABLE' | 'WATCH' | 'WEAKENED' | 'INVALIDATED';

export type SourceType =
  | 'SEC_FILING'
  | 'COMPANY_RELEASE'
  | 'EARNINGS_CALL'
  | 'GOVERNMENT_RELEASE'
  | 'MARKET_DATA'
  | 'ANALYST_OPINION'
  | 'SOCIAL_OPINION';

export type AssumptionStatus = 'HOLDS' | 'UNDER_PRESSURE' | 'UNKNOWN' | 'BROKEN';

export interface InvestmentIdea {
  id: string;
  ticker: Ticker;
  company: string;
  rawText: string;
  sourceLabel: string;
  createdAt: ISODateTime;
}

export interface CausalStep {
  id: string;
  label: string;
  detail?: string;
}

export interface Assumption {
  id: string;
  statement: string;
  rationale: string;
  status: AssumptionStatus;
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  evidenceIds: string[];
}

export interface ResearchQuestion {
  id: string;
  layer: ResearchLayer;
  question: string;
  status: 'ANSWERED' | 'PARTIAL' | 'OPEN';
  assumptionIds: string[];
}

/** Raw source metadata and source-native fact. No AI judgment belongs here. */
export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  type: SourceType;
  url: string;
  publishedAt: ISODateTime;
  availableAt: ISODateTime;
  retrievedAt: ISODateTime;
  rawFact: string;
  fixture: true;
}

/** AI or analyst assessment of a source record against named thesis assumptions. */
export interface EvidenceAssessment {
  id: string;
  sourceId: string;
  title: string;
  layer: ResearchLayer;
  relation: EvidenceRelation;
  confidence: EvidenceConfidence;
  assumptionIds: string[];
  interpretation: string;
  limitations: string;
  assessedAt: ISODateTime;
}

export interface DeterministicMetric {
  id: string;
  label: string;
  value: number;
  unit: '%' | 'USD' | 'INDEX' | 'RATIO';
  period: string;
  calculation: string;
  inputAsOf: ISODateTime;
}

export interface ResearchRun {
  id: string;
  ideaId: string;
  asOf: ISODateTime;
  startedAt: ISODateTime;
  completedAt: ISODateTime;
  status: 'PLANNED' | 'GATHERING' | 'ASSESSING' | 'COMPLETE' | 'FAILED';
  questionIds: string[];
  evidenceIds: string[];
}

export interface ThesisVersion {
  id: string;
  thesisId: string;
  version: number;
  state: ThesisState;
  coreThesis: string;
  causalChain: CausalStep[];
  horizon: string;
  assumptionIds: string[];
  supportingEvidenceIds: string[];
  challengingEvidenceIds: string[];
  uncertainties: string[];
  risks: string[];
  invalidationConditions: string[];
  monitorVariables: string[];
  changedBecause: string;
  createdAt: ISODateTime;
  asOf: ISODateTime;
}

export interface Thesis {
  id: string;
  ticker: Ticker;
  company: string;
  currentVersionId: string;
  followed: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ThesisImpact {
  id: string;
  eventId: string;
  thesisId: string;
  relation: EvidenceRelation;
  materiality: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedAssumptionIds: string[];
  explanation: string;
  stateBefore: ThesisState;
  stateAfter: ThesisState;
  assessedAt: ISODateTime;
}

export interface MonitorEvent {
  id: string;
  title: string;
  summary: string;
  occurredAt: ISODateTime;
  sourceId: string;
  status: 'NEW' | 'REVIEWED' | 'UPCOMING';
  impact: ThesisImpact;
}

export interface IdeaBreakdown {
  ticker: Ticker;
  company: string;
  originalClaim: string;
  coreThesis: string;
  horizon: string;
  causalChain: CausalStep[];
  assumptionIds: string[];
  uncertainties: string[];
  risks: string[];
  researchQuestionIds: string[];
}
