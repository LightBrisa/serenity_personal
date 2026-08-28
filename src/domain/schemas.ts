import { z } from 'zod';

const causalStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1).optional(),
});

export const ideaBreakdownSchema = z.object({
  ticker: z.string().min(1).max(8),
  company: z.string().min(1),
  originalClaim: z.string().min(1),
  coreThesis: z.string().min(1),
  horizon: z.string().min(1),
  causalChain: z.array(causalStepSchema).min(2),
  assumptionIds: z.array(z.string().min(1)).min(1),
  uncertainties: z.array(z.string().min(1)),
  risks: z.array(z.string().min(1)),
  researchQuestionIds: z.array(z.string().min(1)).min(1),
});

export const evidenceAssessmentSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  title: z.string().min(1),
  layer: z.enum(['FUNDAMENTALS', 'INFORMATION', 'MARKET']),
  relation: z.enum(['SUPPORTS', 'CHALLENGES', 'NEUTRAL']),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW', 'UNKNOWN']),
  assumptionIds: z.array(z.string().min(1)).min(1),
  interpretation: z.string().min(1),
  limitations: z.string().min(1),
  assessedAt: z.string().datetime(),
});

export const thesisImpactSchema = z.object({
  id: z.string().min(1),
  eventId: z.string().min(1),
  thesisId: z.string().min(1),
  relation: z.enum(['SUPPORTS', 'CHALLENGES', 'NEUTRAL']),
  materiality: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  affectedAssumptionIds: z.array(z.string().min(1)).min(1),
  explanation: z.string().min(1),
  stateBefore: z.enum(['STRONG', 'STABLE', 'WATCH', 'WEAKENED', 'INVALIDATED']),
  assessedAt: z.string().datetime(),
});

export type ParsedIdeaBreakdown = z.infer<typeof ideaBreakdownSchema>;
export type ParsedEvidenceAssessment = z.infer<typeof evidenceAssessmentSchema>;
export type ParsedThesisImpact = z.infer<typeof thesisImpactSchema>;
