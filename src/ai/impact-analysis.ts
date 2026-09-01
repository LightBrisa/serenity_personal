import { z } from 'zod';

export const IMPACT_PROMPT_VERSION = 'impact-analysis-v1';

export const impactAnalysisInputSchema = z.object({
  provenanceMode: z.enum(['CONTEMPORANEOUS', 'RETROSPECTIVE_FIXTURE']),
  analysisAsOf: z.string().datetime(),
  thesis: z.object({
    id: z.string().min(1).max(120),
    ticker: z.string().min(1).max(8),
    coreThesis: z.string().trim().min(30).max(2_000),
    horizon: z.string().trim().min(1).max(80),
  }).strict(),
  source: z.object({
    id: z.string().min(1).max(120),
    title: z.string().trim().min(1).max(300),
    publisher: z.string().trim().min(1).max(200),
    publishedAt: z.string().datetime(),
    availableAt: z.string().datetime(),
    retrievedAt: z.string().datetime(),
    rawFact: z.string().trim().min(20).max(4_000),
  }).strict(),
  assumptions: z.array(z.object({
    id: z.string().min(1).max(120),
    statement: z.string().trim().min(5).max(800),
  }).strict()).min(1).max(12),
}).strict().superRefine((input, context) => {
  const assumptionIds = input.assumptions.map((item) => item.id);
  if (new Set(assumptionIds).size !== assumptionIds.length) {
    context.addIssue({
      code: 'custom',
      path: ['assumptions'],
      message: '同一次分析中的前提 ID 必须唯一。',
    });
  }
  const publishedAt = Date.parse(input.source.publishedAt);
  const availableAt = Date.parse(input.source.availableAt);
  const retrievedAt = Date.parse(input.source.retrievedAt);
  const analysisAsOf = Date.parse(input.analysisAsOf);

  if (publishedAt > availableAt || availableAt > analysisAsOf) {
    context.addIssue({
      code: 'custom',
      path: ['source', 'availableAt'],
      message: '来源必须先发布、再可获得，并且不得晚于分析时点。',
    });
  }
  if (availableAt > retrievedAt) {
    context.addIssue({
      code: 'custom',
      path: ['source', 'retrievedAt'],
      message: '来源检索时点不得早于它的可获得时点。',
    });
  }
  if (input.provenanceMode === 'CONTEMPORANEOUS' && retrievedAt > analysisAsOf) {
    context.addIssue({
      code: 'custom',
      path: ['source', 'retrievedAt'],
      message: '当时研究模式下，检索时点不得晚于分析时点。',
    });
  }
});

/**
 * This schema is intentionally separate from ThesisImpact. Every field is required
 * because the OpenAI Structured Outputs JSON schema does not accept optional fields.
 * Trusted record IDs and user decision state are added outside the model boundary.
 */
export const generatedImpactAnalysisSchema = z.object({
  relation: z.enum(['SUPPORTS', 'CHALLENGES', 'NEUTRAL']),
  materiality: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  explanation: z.string().trim().min(20).max(1_200),
  affectedAssumptions: z.array(z.object({
    id: z.string().min(1).max(120),
    effect: z.enum(['STRENGTHENS', 'WEAKENS', 'UNCLEAR']),
    rationale: z.string().trim().min(10).max(600),
  }).strict()).max(6),
  evidenceGaps: z.array(z.string().trim().min(5).max(500)).max(6),
  limitations: z.array(z.string().trim().min(5).max(500)).min(1).max(4),
}).strict();

export const modelRunMetaSchema = z.object({
  analysisRunId: z.string().min(1).max(200),
  provider: z.string().min(1).max(80),
  model: z.string().min(1).max(160),
  promptVersion: z.string().min(1).max(120),
  generatedAt: z.string().datetime(),
  inputHash: z.string().regex(/^[a-f0-9]{64}$/),
  sourceIds: z.array(z.string().min(1).max(120)).min(1).max(12),
  thesisVersionId: z.string().min(1).max(120),
  analysisAsOf: z.string().datetime(),
  sourceAvailableAt: z.string().datetime(),
  sourceRetrievedAt: z.string().datetime(),
  sourceContentHash: z.string().regex(/^[a-f0-9]{64}$/),
  provenanceMode: z.enum(['CONTEMPORANEOUS', 'RETROSPECTIVE_FIXTURE']),
}).strict();

export const impactAnalysisResultSchema = z.object({
  analysis: generatedImpactAnalysisSchema,
  meta: modelRunMetaSchema,
}).strict();

export type ImpactAnalysisInput = z.infer<typeof impactAnalysisInputSchema>;
export type GeneratedImpactAnalysis = z.infer<typeof generatedImpactAnalysisSchema>;

export interface ModelRunMeta {
  analysisRunId: string;
  provider: string;
  model: string;
  promptVersion: string;
  generatedAt: string;
  inputHash: string;
  sourceIds: string[];
  thesisVersionId: string;
  analysisAsOf: string;
  sourceAvailableAt: string;
  sourceRetrievedAt: string;
  sourceContentHash: string;
  provenanceMode: ImpactAnalysisInput['provenanceMode'];
}

export interface ImpactAnalysisResult {
  analysis: GeneratedImpactAnalysis;
  meta: ModelRunMeta;
}

export interface ProviderImpactResult {
  analysis: unknown;
  analysisRunId: string;
  provider: string;
  model: string;
  promptVersion: string;
  generatedAt: string;
}

export interface ImpactAnalysisProvider {
  analyze(input: ImpactAnalysisInput): Promise<ProviderImpactResult>;
}

export type ModelCapabilityErrorCode =
  | 'MODEL_NOT_CONFIGURED'
  | 'MODEL_RATE_LIMITED'
  | 'MODEL_TIMEOUT'
  | 'MODEL_REFUSED'
  | 'MODEL_INCOMPLETE'
  | 'MODEL_INVALID_OUTPUT'
  | 'MODEL_UPSTREAM_ERROR';

export class ModelCapabilityError extends Error {
  constructor(
    public readonly code: ModelCapabilityErrorCode,
    public readonly httpStatus: number,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ModelCapabilityError';
  }
}

async function hashText(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function analyzeImpact(
  rawInput: unknown,
  provider: ImpactAnalysisProvider,
): Promise<ImpactAnalysisResult> {
  const input = impactAnalysisInputSchema.parse(rawInput);
  const providerResult = await provider.analyze(input);
  const parsed = generatedImpactAnalysisSchema.safeParse(providerResult.analysis);

  if (!parsed.success) {
    throw new ModelCapabilityError(
      'MODEL_INVALID_OUTPUT',
      502,
      '模型返回的结构未通过校验。',
      { cause: parsed.error },
    );
  }

  const allowedIds = new Set(input.assumptions.map((item) => item.id));
  const returnedIds = parsed.data.affectedAssumptions.map((item) => item.id);
  const containsUnknownId = returnedIds.some((id) => !allowedIds.has(id));
  const containsDuplicateId = new Set(returnedIds).size !== returnedIds.length;

  if (containsUnknownId || containsDuplicateId) {
    throw new ModelCapabilityError(
      'MODEL_INVALID_OUTPUT',
      502,
      '模型引用了本次输入之外或重复的前提。',
    );
  }

  if (parsed.data.relation !== 'NEUTRAL' && returnedIds.length === 0) {
    throw new ModelCapabilityError(
      'MODEL_INVALID_OUTPUT',
      502,
      '非中性分析必须指明至少一个受影响前提。',
    );
  }

  return {
    analysis: parsed.data,
    meta: {
      analysisRunId: providerResult.analysisRunId,
      provider: providerResult.provider,
      model: providerResult.model,
      promptVersion: providerResult.promptVersion,
      generatedAt: providerResult.generatedAt,
      inputHash: await hashText(JSON.stringify(input)),
      sourceIds: [input.source.id],
      thesisVersionId: input.thesis.id,
      analysisAsOf: input.analysisAsOf,
      sourceAvailableAt: input.source.availableAt,
      sourceRetrievedAt: input.source.retrievedAt,
      sourceContentHash: await hashText(input.source.rawFact),
      provenanceMode: input.provenanceMode,
    },
  };
}
