import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

const timestamps = {
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
};

export const investmentIdeas = sqliteTable('investment_ideas', {
  id: text('id').primaryKey(),
  ticker: text('ticker').notNull(),
  company: text('company').notNull(),
  rawText: text('raw_text').notNull(),
  sourceLabel: text('source_label').notNull(),
  ...timestamps,
});

export const theses = sqliteTable('theses', {
  id: text('id').primaryKey(),
  ideaId: text('idea_id').notNull().references(() => investmentIdeas.id),
  ticker: text('ticker').notNull(),
  company: text('company').notNull(),
  currentVersionId: text('current_version_id'),
  followed: integer('followed', { mode: 'boolean' }).notNull().default(false),
  ...timestamps,
});

export const thesisVersions = sqliteTable(
  'thesis_versions',
  {
    id: text('id').primaryKey(),
    thesisId: text('thesis_id').notNull().references(() => theses.id),
    version: integer('version').notNull(),
    state: text('state').notNull(),
    coreThesis: text('core_thesis').notNull(),
    causalChainJson: text('causal_chain_json').notNull(),
    horizon: text('horizon').notNull(),
    uncertaintiesJson: text('uncertainties_json').notNull(),
    risksJson: text('risks_json').notNull(),
    invalidationConditionsJson: text('invalidation_conditions_json').notNull(),
    monitorVariablesJson: text('monitor_variables_json').notNull(),
    changedBecause: text('changed_because').notNull(),
    asOf: text('as_of').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [uniqueIndex('thesis_version_unique').on(table.thesisId, table.version)],
);

export const assumptions = sqliteTable('assumptions', {
  id: text('id').primaryKey(),
  thesisVersionId: text('thesis_version_id').notNull().references(() => thesisVersions.id),
  statement: text('statement').notNull(),
  rationale: text('rationale').notNull(),
  status: text('status').notNull(),
  importance: text('importance').notNull(),
});

export const researchQuestions = sqliteTable('research_questions', {
  id: text('id').primaryKey(),
  ideaId: text('idea_id').notNull().references(() => investmentIdeas.id),
  layer: text('layer').notNull(),
  question: text('question').notNull(),
  status: text('status').notNull(),
  assumptionIdsJson: text('assumption_ids_json').notNull(),
});

export const researchRuns = sqliteTable('research_runs', {
  id: text('id').primaryKey(),
  ideaId: text('idea_id').notNull().references(() => investmentIdeas.id),
  asOf: text('as_of').notNull(),
  status: text('status').notNull(),
  startedAt: text('started_at').notNull(),
  completedAt: text('completed_at'),
});

export const sources = sqliteTable('sources', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  publisher: text('publisher').notNull(),
  sourceType: text('source_type').notNull(),
  sourceUrl: text('source_url').notNull(),
  publishedAt: text('published_at').notNull(),
  availableAt: text('available_at').notNull(),
  retrievedAt: text('retrieved_at').notNull(),
  rawFact: text('raw_fact').notNull(),
});

export const evidence = sqliteTable('evidence', {
  id: text('id').primaryKey(),
  researchRunId: text('research_run_id').notNull().references(() => researchRuns.id),
  sourceId: text('source_id').notNull().references(() => sources.id),
  title: text('title').notNull(),
  layer: text('layer').notNull(),
  relation: text('relation').notNull(),
  confidence: text('confidence').notNull(),
  interpretation: text('interpretation').notNull(),
  limitations: text('limitations').notNull(),
  assessedAt: text('assessed_at').notNull(),
});

export const evidenceAssumptions = sqliteTable(
  'evidence_assumptions',
  {
    evidenceId: text('evidence_id').notNull().references(() => evidence.id),
    assumptionId: text('assumption_id').notNull().references(() => assumptions.id),
  },
  (table) => [uniqueIndex('evidence_assumption_unique').on(table.evidenceId, table.assumptionId)],
);

export const monitorEvents = sqliteTable('monitor_events', {
  id: text('id').primaryKey(),
  thesisId: text('thesis_id').notNull().references(() => theses.id),
  sourceId: text('source_id').notNull().references(() => sources.id),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  occurredAt: text('occurred_at').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const thesisImpacts = sqliteTable('thesis_impacts', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => monitorEvents.id),
  thesisId: text('thesis_id').notNull().references(() => theses.id),
  relation: text('relation').notNull(),
  materiality: text('materiality').notNull(),
  affectedAssumptionIdsJson: text('affected_assumption_ids_json').notNull(),
  explanation: text('explanation').notNull(),
  stateBefore: text('state_before').notNull(),
  assessedAt: text('assessed_at').notNull(),
});
