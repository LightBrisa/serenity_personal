import type {
  Assumption,
  EvidenceAssessment,
  IdeaBreakdown,
  InvestmentIdea,
  MonitorEvent,
  ResearchQuestion,
  ResearchRun,
  SourceRecord,
  Thesis,
  ThesisVersion,
} from '@/src/domain/types';

export const fixtureMeta = {
  label: 'DEMO FIXTURE',
  researchAsOf: '2025-02-27T00:00:00.000Z',
  currentAsOf: '2025-04-16T12:00:00.000Z',
  retrievedAt: '2026-08-25T06:00:00.000Z',
  disclaimer: 'Historical snapshot for product demonstration. Not live market data or investment advice.',
} as const;

export const nvdaIdea: InvestmentIdea = {
  id: 'idea-nvda-ai-capex',
  ticker: 'NVDA',
  company: 'NVIDIA Corporation',
  rawText: 'AI infrastructure spending will keep growing over the next 12–18 months, so NVIDIA should continue benefiting.',
  sourceLabel: 'Pasted idea',
  createdAt: '2025-02-27T00:00:00.000Z',
};

export const nvdaCausalChain = [
  { id: 'chain-capex', label: 'AI infrastructure budgets rise', detail: 'Hyperscalers keep expanding compute capacity.' },
  { id: 'chain-compute', label: 'Accelerated compute demand rises', detail: 'Training and inference consume more GPU capacity.' },
  { id: 'chain-nvda', label: 'NVIDIA demand remains strong', detail: 'Blackwell adoption converts budgets into shipments.' },
  { id: 'chain-earnings', label: 'Revenue and earnings compound', detail: 'Growth persists without unacceptable margin erosion.' },
] as const;

export const nvdaAssumptions: Assumption[] = [
  {
    id: 'assumption-demand',
    statement: 'Large cloud and technology companies sustain elevated AI infrastructure investment.',
    rationale: 'The thesis begins with continued end-market demand rather than NVIDIA execution alone.',
    status: 'HOLDS',
    importance: 'CRITICAL',
    evidenceIds: ['ev-fy25-growth', 'ev-microsoft-capex', 'ev-alphabet-capex', 'ev-meta-capex'],
  },
  {
    id: 'assumption-blackwell',
    statement: 'Blackwell ramps quickly enough to satisfy demand without a prolonged transition gap.',
    rationale: 'The product transition must convert announced demand into realized revenue.',
    status: 'HOLDS',
    importance: 'CRITICAL',
    evidenceIds: ['ev-blackwell-ramp', 'ev-margin-pressure'],
  },
  {
    id: 'assumption-leadership',
    statement: 'NVIDIA preserves a meaningful share of accelerated-computing spend despite custom silicon.',
    rationale: 'Rising AI budgets do not automatically become NVIDIA revenue.',
    status: 'UNDER_PRESSURE',
    importance: 'HIGH',
    evidenceIds: ['ev-custom-silicon', 'ev-alphabet-capex'],
  },
  {
    id: 'assumption-margin',
    statement: 'Blackwell transition costs are temporary and gross margin stabilizes after the ramp.',
    rationale: 'Revenue growth has less thesis value if system complexity structurally erodes economics.',
    status: 'UNDER_PRESSURE',
    importance: 'HIGH',
    evidenceIds: ['ev-margin-pressure'],
  },
  {
    id: 'assumption-access',
    statement: 'Export restrictions do not remove a material share of NVIDIA’s accessible AI market.',
    rationale: 'Regulation can reduce addressable demand independently of product competitiveness.',
    status: 'UNDER_PRESSURE',
    importance: 'CRITICAL',
    evidenceIds: ['ev-export-controls', 'ev-h20-license'],
  },
  {
    id: 'assumption-valuation',
    statement: 'The market price does not already discount the full upside from continued AI growth.',
    rationale: 'A strong company outcome can still produce a weak investment outcome at an excessive entry valuation.',
    status: 'UNKNOWN',
    importance: 'HIGH',
    evidenceIds: ['ev-market-context'],
  },
];

export const nvdaResearchQuestions: ResearchQuestion[] = [
  { id: 'rq-capex', layer: 'FUNDAMENTALS', question: 'Are the largest AI infrastructure buyers still expanding capacity?', status: 'ANSWERED', assumptionIds: ['assumption-demand'] },
  { id: 'rq-blackwell', layer: 'FUNDAMENTALS', question: 'Is Blackwell converting demand into material revenue?', status: 'ANSWERED', assumptionIds: ['assumption-blackwell'] },
  { id: 'rq-margin', layer: 'FUNDAMENTALS', question: 'Are lower launch margins temporary or structural?', status: 'PARTIAL', assumptionIds: ['assumption-margin'] },
  { id: 'rq-competition', layer: 'FUNDAMENTALS', question: 'How much spend can hyperscaler custom silicon absorb?', status: 'OPEN', assumptionIds: ['assumption-leadership'] },
  { id: 'rq-regulation', layer: 'INFORMATION', question: 'Could export controls materially narrow NVIDIA’s addressable market?', status: 'PARTIAL', assumptionIds: ['assumption-access'] },
  { id: 'rq-expectations', layer: 'INFORMATION', question: 'Which expectations are management statements versus realized facts?', status: 'ANSWERED', assumptionIds: ['assumption-demand', 'assumption-blackwell'] },
  { id: 'rq-valuation', layer: 'MARKET', question: 'How much future growth may already be priced in?', status: 'OPEN', assumptionIds: ['assumption-valuation'] },
];

export const nvdaIdeaBreakdown: IdeaBreakdown = {
  ticker: 'NVDA',
  company: 'NVIDIA Corporation',
  originalClaim: nvdaIdea.rawText,
  coreThesis: 'Sustained AI infrastructure investment may support NVIDIA’s data-center growth over the next 12–18 months, provided Blackwell execution, market access, margins, and competitive share remain resilient.',
  horizon: '12–18 months',
  causalChain: [...nvdaCausalChain],
  assumptionIds: nvdaAssumptions.map((item) => item.id),
  uncertainties: [
    'The portion of hyperscaler capital expenditure that will translate directly into NVIDIA revenue is not disclosed.',
    'The duration and severity of Blackwell-related gross-margin pressure remains uncertain.',
    'A point-in-time valuation conclusion is unavailable without a trusted market-data provider.',
  ],
  risks: [
    'Export controls reduce the accessible market or accelerate domestic alternatives.',
    'Hyperscaler custom silicon captures more workloads than expected.',
    'AI demand growth slows before customers earn acceptable returns on infrastructure spend.',
  ],
  researchQuestionIds: nvdaResearchQuestions.map((item) => item.id),
};

const makeSource = (source: Omit<SourceRecord, 'retrievedAt' | 'fixture'>): SourceRecord => ({
  ...source,
  retrievedAt: fixtureMeta.retrievedAt,
  fixture: true,
});

export const nvdaSources: SourceRecord[] = [
  makeSource({
    id: 'src-fy25-10k-growth',
    title: 'NVIDIA FY2025 Form 10-K · Results',
    publisher: 'NVIDIA / U.S. SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:00:00.000Z',
    rawFact: 'FY2025 revenue was $130.497 billion, up 114%; Data Center revenue was $115.186 billion, up 142%.',
  }),
  makeSource({
    id: 'src-q4-results',
    title: 'NVIDIA Q4 and FY2025 Results',
    publisher: 'NVIDIA Investor Relations',
    type: 'COMPANY_RELEASE',
    url: 'https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Announces-Financial-Results-for-Fourth-Quarter-and-Fiscal-2025/default.aspx',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:20:00.000Z',
    rawFact: 'Q4 revenue was $39.331 billion and Data Center revenue was $35.580 billion. NVIDIA reported $11.0 billion of Blackwell revenue in the quarter.',
  }),
  makeSource({
    id: 'src-msft-q2',
    title: 'Microsoft FY2025 Q2 Earnings Call',
    publisher: 'Microsoft Investor Relations',
    type: 'EARNINGS_CALL',
    url: 'https://www.microsoft.com/en-us/investor/events/fy-2025/earnings-fy-2025-q2',
    publishedAt: '2025-01-29T00:00:00.000Z',
    availableAt: '2025-01-29T22:30:00.000Z',
    rawFact: 'Microsoft reported $22.6 billion of quarterly capital expenditure including finance leases and said its AI business had surpassed a $13 billion annual revenue run rate.',
  }),
  makeSource({
    id: 'src-alphabet-q4',
    title: 'Alphabet 2024 Q4 Earnings Call',
    publisher: 'Alphabet Investor Relations',
    type: 'EARNINGS_CALL',
    url: 'https://abc.xyz/investor/events/event-details/2025/2024-Q4-Earnings-Call/',
    publishedAt: '2025-02-04T00:00:00.000Z',
    availableAt: '2025-02-04T22:00:00.000Z',
    rawFact: 'Alphabet reported $14 billion of Q4 capital expenditure and guided to approximately $75 billion for 2025, primarily for servers and data centers.',
  }),
  makeSource({
    id: 'src-meta-q4',
    title: 'Meta Q4 and FY2024 Results',
    publisher: 'Meta Investor Relations',
    type: 'COMPANY_RELEASE',
    url: 'https://investor.atmeta.com/investor-news/press-release-details/2025/Meta-Reports-Fourth-Quarter-and-Full-Year-2024-Results/default.aspx',
    publishedAt: '2025-01-29T00:00:00.000Z',
    availableAt: '2025-01-29T21:05:00.000Z',
    rawFact: 'Meta reported $39.23 billion of 2024 capital expenditure and guided to $60–65 billion for 2025, with growth driven by generative AI and the core business.',
  }),
  makeSource({
    id: 'src-q4-margin',
    title: 'NVIDIA Q4 and FY2025 Results · Margin Guidance',
    publisher: 'NVIDIA Investor Relations',
    type: 'COMPANY_RELEASE',
    url: 'https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Announces-Financial-Results-for-Fourth-Quarter-and-Fiscal-2025/default.aspx',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:20:00.000Z',
    rawFact: 'Q4 GAAP gross margin was 73.0%, down from 74.6% sequentially; Q1 FY2026 GAAP gross margin was guided to 70.6% ±50 basis points.',
  }),
  makeSource({
    id: 'src-fy25-10k-concentration',
    title: 'NVIDIA FY2025 Form 10-K · Customer Concentration',
    publisher: 'NVIDIA / U.S. SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:00:00.000Z',
    rawFact: 'Direct Customers A, B, and C represented 12%, 11%, and 11% of FY2025 revenue; one estimated indirect customer also represented at least 10%.',
  }),
  makeSource({
    id: 'src-fy25-10k-export',
    title: 'NVIDIA FY2025 Form 10-K · Export Controls',
    publisher: 'NVIDIA / U.S. SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:00:00.000Z',
    rawFact: 'NVIDIA said China Data Center revenue remained well below its pre-October-2023 share and existing export controls had harmed its competitive position.',
  }),
  makeSource({
    id: 'src-fy25-10k-competition',
    title: 'NVIDIA FY2025 Form 10-K · Competition',
    publisher: 'NVIDIA / U.S. SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:00:00.000Z',
    rawFact: 'NVIDIA identified Alphabet, Amazon, and Microsoft internal accelerated-computing hardware teams as competitors.',
  }),
  makeSource({
    id: 'src-tsmc-chips',
    title: 'Commerce Final TSMC Arizona CHIPS Award',
    publisher: 'U.S. Department of Commerce',
    type: 'GOVERNMENT_RELEASE',
    url: 'https://www.commerce.gov/news/press-releases/2024/11/biden-harris-administration-announces-chips-incentives-award-tsmc',
    publishedAt: '2024-11-15T00:00:00.000Z',
    availableAt: '2024-11-15T14:00:00.000Z',
    rawFact: 'Commerce announced up to $6.6 billion in milestone-based direct funding supporting more than $65 billion of planned investment in three TSMC Arizona fabs.',
  }),
  makeSource({
    id: 'src-market-fixture',
    title: 'Illustrative normalized price series',
    publisher: 'Serenity fixture generator',
    type: 'MARKET_DATA',
    url: 'https://example.invalid/serenity-fixture',
    publishedAt: '2025-02-27T00:00:00.000Z',
    availableAt: '2025-02-27T00:00:00.000Z',
    rawFact: 'Synthetic normalized index values [100, 106, 103, 111, 116, 114] are provided only to demonstrate deterministic return and moving-average UI.',
  }),
  makeSource({
    id: 'src-h20-8k',
    title: 'NVIDIA Form 8-K · H20 Export License Requirement',
    publisher: 'NVIDIA / U.S. SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000082/nvda-20250409.htm',
    publishedAt: '2025-04-15T00:00:00.000Z',
    availableAt: '2025-04-15T21:22:59.000Z',
    rawFact: 'NVIDIA disclosed that the U.S. government required a license for H20 exports to China and related destinations and expected up to approximately $5.5 billion of Q1 FY2026 charges.',
  }),
  makeSource({
    id: 'src-ai-diffusion-rule',
    title: 'Framework for Artificial Intelligence Diffusion',
    publisher: 'U.S. Department of Commerce / Federal Register',
    type: 'GOVERNMENT_RELEASE',
    url: 'https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion',
    publishedAt: '2025-01-15T00:00:00.000Z',
    availableAt: '2025-01-15T05:00:00.000Z',
    rawFact: 'The rule scheduled a May 15, 2025 compliance date and contemplated worldwide licensing requirements for covered advanced chips.',
  }),
];

const assess = (assessment: EvidenceAssessment) => assessment;

export const nvdaEvidence: EvidenceAssessment[] = [
  assess({ id: 'ev-fy25-growth', sourceId: 'src-fy25-10k-growth', title: 'Realized data-center growth was exceptional', layer: 'FUNDAMENTALS', relation: 'SUPPORTS', confidence: 'HIGH', assumptionIds: ['assumption-demand'], interpretation: 'Audited annual results show the demand thesis was supported by realized sales, not only management forecasts.', limitations: 'Historical growth does not establish its duration or the return buyers earn on AI infrastructure.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-blackwell-ramp', sourceId: 'src-q4-results', title: 'Blackwell became material in its first production quarter', layer: 'FUNDAMENTALS', relation: 'SUPPORTS', confidence: 'HIGH', assumptionIds: ['assumption-blackwell'], interpretation: 'The reported $11.0 billion Blackwell quarter reduces near-term architecture-transition risk.', limitations: 'The figure is company-reported and does not show end-customer utilization or sustainable margin.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-microsoft-capex', sourceId: 'src-msft-q2', title: 'Microsoft remained capacity-constrained while monetizing AI', layer: 'INFORMATION', relation: 'SUPPORTS', confidence: 'MEDIUM', assumptionIds: ['assumption-demand'], interpretation: 'Backlog, monetization, and capacity commentary from a major buyer support continued infrastructure demand.', limitations: 'Management commentary does not establish how much spend flows to NVIDIA.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-alphabet-capex', sourceId: 'src-alphabet-q4', title: 'Alphabet guided to a large step-up in infrastructure spend', layer: 'INFORMATION', relation: 'SUPPORTS', confidence: 'MEDIUM', assumptionIds: ['assumption-demand', 'assumption-blackwell'], interpretation: 'The guidance independently corroborates rising compute demand and live Blackwell adoption.', limitations: 'Alphabet also deploys its own TPUs; not all server and data-center spend is AI or NVIDIA-related.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-meta-capex', sourceId: 'src-meta-q4', title: 'Meta broadened evidence of elevated buyer budgets', layer: 'INFORMATION', relation: 'SUPPORTS', confidence: 'MEDIUM', assumptionIds: ['assumption-demand'], interpretation: 'A second major buyer’s spending increase reduces reliance on a single cloud provider’s plan.', limitations: 'Meta said most capital expenditure would still serve the core business; it is not all NVIDIA spend.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-margin-pressure', sourceId: 'src-q4-margin', title: 'The Blackwell ramp was pressuring gross margin', layer: 'FUNDAMENTALS', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-margin', 'assumption-blackwell'], interpretation: 'Revenue acceleration coincided with lower margins, making recovery a necessary thesis checkpoint.', limitations: 'Launch-period system costs may be temporary; one guidance period cannot establish a structural decline.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-concentration', sourceId: 'src-fy25-10k-concentration', title: 'A small set of purchasing relationships remained material', layer: 'FUNDAMENTALS', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-demand'], interpretation: 'Customer concentration can amplify bargaining power and quarter-to-quarter demand volatility.', limitations: 'Named end demand may differ from direct-customer billing relationships.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-export-controls', sourceId: 'src-fy25-10k-export', title: 'Export controls had already reduced market access', layer: 'INFORMATION', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-access'], interpretation: 'Regulatory limits can shrink the addressable market independently of NVIDIA’s product execution.', limitations: 'The competitive-position effect is NVIDIA’s own risk disclosure, not an independent market-share measurement.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-custom-silicon', sourceId: 'src-fy25-10k-competition', title: 'The largest buyers were also silicon competitors', layer: 'FUNDAMENTALS', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-leadership'], interpretation: 'Expanding AI budgets need not translate one-for-one into NVIDIA revenue.', limitations: 'The filing names competitive efforts but does not quantify their workload share or relative economics.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-tsmc-resilience', sourceId: 'src-tsmc-chips', title: 'Domestic leading-edge capacity may improve resilience over time', layer: 'FUNDAMENTALS', relation: 'NEUTRAL', confidence: 'MEDIUM', assumptionIds: ['assumption-blackwell'], interpretation: 'Additional U.S. capacity could reduce long-run geographic concentration risk.', limitations: 'Timing is multi-year and the award disclosed no NVIDIA-specific capacity allocation.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-market-context', sourceId: 'src-market-fixture', title: 'Illustrative market context only', layer: 'MARKET', relation: 'NEUTRAL', confidence: 'LOW', assumptionIds: ['assumption-valuation'], interpretation: 'The synthetic series demonstrates deterministic context calculations but cannot support a valuation conclusion.', limitations: 'No live or licensed market-data provider is connected. Current valuation remains UNKNOWN.', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-h20-license', sourceId: 'src-h20-8k', title: 'H20 licensing requirement created a direct financial impact', layer: 'INFORMATION', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-access', 'assumption-margin'], interpretation: 'The indefinite license requirement and expected charge materially weaken the market-access assumption and add near-term margin pressure.', limitations: 'The filing estimated a charge; later realized demand, licensing outcomes, and mitigation were not yet known at assessment time.', assessedAt: fixtureMeta.currentAsOf }),
];

export const nvdaResearchRun: ResearchRun = {
  id: 'research-nvda-2025-02-27',
  ideaId: nvdaIdea.id,
  asOf: fixtureMeta.researchAsOf,
  startedAt: '2025-02-26T23:30:00.000Z',
  completedAt: fixtureMeta.researchAsOf,
  status: 'COMPLETE',
  questionIds: nvdaResearchQuestions.map((item) => item.id),
  evidenceIds: nvdaEvidence.filter((item) => item.assessedAt <= fixtureMeta.researchAsOf).map((item) => item.id),
};

export const nvdaThesis: Thesis = {
  id: 'thesis-nvda-ai-capex',
  ticker: 'NVDA',
  company: 'NVIDIA Corporation',
  currentVersionId: 'thesis-nvda-v2',
  followed: true,
  createdAt: fixtureMeta.researchAsOf,
  updatedAt: fixtureMeta.currentAsOf,
};

const sharedThesis = {
  thesisId: nvdaThesis.id,
  causalChain: [...nvdaCausalChain],
  horizon: '12–18 months',
  assumptionIds: nvdaAssumptions.map((item) => item.id),
  supportingEvidenceIds: nvdaEvidence.filter((item) => item.relation === 'SUPPORTS').map((item) => item.id),
  challengingEvidenceIds: nvdaEvidence.filter((item) => item.relation === 'CHALLENGES' && item.id !== 'ev-h20-license').map((item) => item.id),
  uncertainties: nvdaIdeaBreakdown.uncertainties,
  risks: nvdaIdeaBreakdown.risks,
  invalidationConditions: [
    'Two or more major AI infrastructure buyers materially reduce forward spending plans.',
    'Blackwell revenue stalls for reasons other than temporary supply constraints.',
    'Gross margin fails to recover after the architecture ramp matures.',
    'Export controls or customer substitution remove a material portion of accessible demand.',
  ],
  monitorVariables: [
    'Hyperscaler capital-expenditure guidance and AI capacity commentary',
    'Blackwell revenue, shipment cadence, and supply commentary',
    'Data Center growth and gross-margin progression',
    'Export-control rules, licenses, and related charges',
    'Custom-accelerator adoption at major cloud buyers',
  ],
};

export const nvdaThesisVersions: ThesisVersion[] = [
  {
    ...sharedThesis,
    id: 'thesis-nvda-v1',
    version: 1,
    state: 'STABLE',
    coreThesis: nvdaIdeaBreakdown.coreThesis,
    changedBecause: 'Initial thesis generated from the evidence ledger available at the research cutoff.',
    createdAt: fixtureMeta.researchAsOf,
    asOf: fixtureMeta.researchAsOf,
  },
  {
    ...sharedThesis,
    id: 'thesis-nvda-v2',
    version: 2,
    state: 'WATCH',
    coreThesis: 'AI infrastructure investment still supports NVIDIA’s demand outlook, but the new H20 export restriction materially weakens market access and raises near-term economic uncertainty.',
    challengingEvidenceIds: [...sharedThesis.challengingEvidenceIds, 'ev-h20-license'],
    changedBecause: 'A new U.S. export-license requirement for H20 products affected a critical market-access assumption and introduced an expected charge.',
    createdAt: fixtureMeta.currentAsOf,
    asOf: fixtureMeta.currentAsOf,
  },
];

export const currentNvdaThesisVersion = nvdaThesisVersions.at(-1)!;

export const nvdaMonitorEvents: MonitorEvent[] = [
  {
    id: 'event-h20-license',
    title: 'New H20 export license requirement creates direct financial impact',
    summary: 'NVIDIA disclosed an indefinite U.S. license requirement for H20 exports to China and related destinations, with up to approximately $5.5 billion of expected Q1 FY2026 charges.',
    occurredAt: '2025-04-15T21:22:59.000Z',
    sourceId: 'src-h20-8k',
    status: 'REVIEWED',
    impact: {
      id: 'impact-h20-license', eventId: 'event-h20-license', thesisId: nvdaThesis.id, relation: 'CHALLENGES', materiality: 'HIGH',
      affectedAssumptionIds: ['assumption-access', 'assumption-margin'],
      explanation: 'This converts a known regulatory risk into an immediate product restriction and expected financial charge. It weakens the thesis, but does not by itself establish that global AI demand or Blackwell adoption has reversed.',
      stateBefore: 'STABLE', stateAfter: 'WATCH', assessedAt: fixtureMeta.currentAsOf,
    },
  },
  {
    id: 'event-q1-results',
    title: 'Upcoming: NVIDIA Q1 FY2026 results',
    summary: 'Compare reported revenue with the company’s $43.0 billion ±2% guidance and GAAP gross margin with 70.6% ±50 basis points. Watch Blackwell mix and margin-recovery language.',
    occurredAt: '2025-05-28T20:00:00.000Z',
    sourceId: 'src-q4-results',
    status: 'UPCOMING',
    impact: {
      id: 'impact-q1-upcoming', eventId: 'event-q1-results', thesisId: nvdaThesis.id, relation: 'NEUTRAL', materiality: 'HIGH',
      affectedAssumptionIds: ['assumption-blackwell', 'assumption-margin'],
      explanation: 'This is the next direct test of whether rapid Blackwell growth can coexist with stabilizing economics. No outcome is assumed in this fixture.',
      stateBefore: 'WATCH', stateAfter: 'WATCH', assessedAt: fixtureMeta.currentAsOf,
    },
  },
  {
    id: 'event-ai-diffusion',
    title: 'Upcoming: AI Diffusion rule compliance date',
    summary: 'Monitor implementation, licensing guidance, country allocations, and company-estimated demand effects before the scheduled compliance date.',
    occurredAt: '2025-05-15T04:00:00.000Z',
    sourceId: 'src-ai-diffusion-rule',
    status: 'UPCOMING',
    impact: {
      id: 'impact-ai-diffusion', eventId: 'event-ai-diffusion', thesisId: nvdaThesis.id, relation: 'NEUTRAL', materiality: 'MEDIUM',
      affectedAssumptionIds: ['assumption-access'],
      explanation: 'The rule could alter international market access, but the realized effect was unknown at the monitor cutoff.',
      stateBefore: 'WATCH', stateAfter: 'WATCH', assessedAt: fixtureMeta.currentAsOf,
    },
  },
];

export const normalizedMarketSeries = [100, 106, 103, 111, 116, 114] as const;

export const nvdaSourcesById = Object.fromEntries(nvdaSources.map((item) => [item.id, item])) as Record<string, SourceRecord>;
export const nvdaAssumptionsById = Object.fromEntries(nvdaAssumptions.map((item) => [item.id, item])) as Record<string, Assumption>;
export const nvdaEvidenceById = Object.fromEntries(nvdaEvidence.map((item) => [item.id, item])) as Record<string, EvidenceAssessment>;
