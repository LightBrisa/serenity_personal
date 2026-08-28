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
  label: '演示数据',
  researchAsOf: '2025-02-27T00:00:00.000Z',
  currentAsOf: '2025-04-16T12:00:00.000Z',
  retrievedAt: '2026-08-25T06:00:00.000Z',
  disclaimer: '这是用于产品演示的历史快照，不是实时市场数据，也不构成投资建议。',
} as const;

export const nvdaIdea: InvestmentIdea = {
  id: 'idea-nvda-ai-capex',
  ticker: 'NVDA',
  company: '英伟达（NVIDIA）',
  rawText: '未来 12–18 个月，AI 基础设施投入还会继续增加，因此 NVIDIA 仍会受益。',
  sourceLabel: '手动粘贴',
  createdAt: '2025-02-27T00:00:00.000Z',
};

export const nvdaCausalChain = [
  { id: 'chain-capex', label: 'AI 基础设施预算增加', detail: '大型云厂商继续扩充算力。' },
  { id: 'chain-compute', label: '加速计算需求上升', detail: '训练和推理需要更多 GPU 算力。' },
  { id: 'chain-nvda', label: 'NVIDIA 需求保持强劲', detail: 'Blackwell 的采用把预算转化为实际出货。' },
  { id: 'chain-earnings', label: '收入和利润持续增长', detail: '增长延续，同时毛利率没有出现难以接受的下滑。' },
] as const;

export const nvdaAssumptions: Assumption[] = [
  {
    id: 'assumption-demand',
    statement: '大型云厂商和科技公司维持较高的 AI 基础设施投入。',
    rationale: '这项判断首先取决于终端需求能否延续，而不只是 NVIDIA 自身的执行。',
    status: 'HOLDS',
    importance: 'CRITICAL',
    evidenceIds: ['ev-fy25-growth', 'ev-microsoft-capex', 'ev-alphabet-capex', 'ev-meta-capex'],
  },
  {
    id: 'assumption-blackwell',
    statement: 'Blackwell 能较快放量，在满足需求的同时避免产品切换造成长期断档。',
    rationale: '产品换代必须把已披露的需求转化为实际收入。',
    status: 'HOLDS',
    importance: 'CRITICAL',
    evidenceIds: ['ev-blackwell-ramp', 'ev-margin-pressure'],
  },
  {
    id: 'assumption-leadership',
    statement: '即使面对自研芯片竞争，NVIDIA 仍能在加速计算投入中保持可观份额。',
    rationale: 'AI 预算增长不等于 NVIDIA 收入会同步增长。',
    status: 'UNDER_PRESSURE',
    importance: 'HIGH',
    evidenceIds: ['ev-custom-silicon', 'ev-alphabet-capex'],
  },
  {
    id: 'assumption-margin',
    statement: 'Blackwell 换代成本是暂时的，放量后毛利率能够企稳。',
    rationale: '如果系统复杂度长期侵蚀盈利能力，收入增长对这项判断的支撑会明显减弱。',
    status: 'UNDER_PRESSURE',
    importance: 'HIGH',
    evidenceIds: ['ev-margin-pressure'],
  },
  {
    id: 'assumption-access',
    statement: '出口限制不会显著压缩 NVIDIA 可以覆盖的 AI 市场。',
    rationale: '即使产品竞争力不变，监管也可能减少可触达的需求。',
    status: 'UNDER_PRESSURE',
    importance: 'CRITICAL',
    evidenceIds: ['ev-export-controls', 'ev-h20-license'],
  },
  {
    id: 'assumption-valuation',
    statement: '当前股价尚未完全计入 AI 持续增长带来的上行空间。',
    rationale: '如果买入估值过高，即使公司经营表现出色，投资回报也可能不理想。',
    status: 'UNKNOWN',
    importance: 'HIGH',
    evidenceIds: ['ev-market-context'],
  },
];

export const nvdaResearchQuestions: ResearchQuestion[] = [
  { id: 'rq-capex', layer: 'FUNDAMENTALS', question: '最大的几家 AI 基础设施买家是否仍在扩充算力？', status: 'ANSWERED', assumptionIds: ['assumption-demand'] },
  { id: 'rq-blackwell', layer: 'FUNDAMENTALS', question: 'Blackwell 是否已把需求转化为可观收入？', status: 'ANSWERED', assumptionIds: ['assumption-blackwell'] },
  { id: 'rq-margin', layer: 'FUNDAMENTALS', question: '新品上市初期的毛利率下滑是暂时现象，还是长期问题？', status: 'PARTIAL', assumptionIds: ['assumption-margin'] },
  { id: 'rq-competition', layer: 'FUNDAMENTALS', question: '大型云厂商的自研芯片会分走多少投入？', status: 'OPEN', assumptionIds: ['assumption-leadership'] },
  { id: 'rq-regulation', layer: 'INFORMATION', question: '出口管制是否会显著缩小 NVIDIA 的可服务市场？', status: 'PARTIAL', assumptionIds: ['assumption-access'] },
  { id: 'rq-expectations', layer: 'INFORMATION', question: '哪些预期只是管理层表态，哪些已经得到实际结果验证？', status: 'ANSWERED', assumptionIds: ['assumption-demand', 'assumption-blackwell'] },
  { id: 'rq-valuation', layer: 'MARKET', question: '当前价格可能已经计入了多少未来增长？', status: 'OPEN', assumptionIds: ['assumption-valuation'] },
];

export const nvdaIdeaBreakdown: IdeaBreakdown = {
  ticker: 'NVDA',
  company: '英伟达（NVIDIA）',
  originalClaim: nvdaIdea.rawText,
  coreThesis: '如果 Blackwell 推进顺利、市场准入未进一步恶化，毛利率和竞争份额也能守住，那么持续的 AI 基础设施投入有望支撑 NVIDIA 数据中心业务在未来 12–18 个月继续增长。',
  horizon: '12–18 个月',
  causalChain: [...nvdaCausalChain],
  assumptionIds: nvdaAssumptions.map((item) => item.id),
  uncertainties: [
    '大型云厂商的资本开支中，最终有多少会直接转化为 NVIDIA 收入，目前没有公开数据。',
    'Blackwell 带来的毛利率压力会持续多久、影响多大，仍不确定。',
    '在没有可靠市场数据源的情况下，目前无法给出时点估值结论。',
  ],
  risks: [
    '出口管制缩小可触达市场，或加快本土替代方案的发展。',
    '大型云厂商的自研芯片承接了超出预期的工作负载。',
    '客户尚未从基础设施投入中取得可接受回报，AI 需求增速就先行放缓。',
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
    title: 'NVIDIA 2025 财年 Form 10-K · 经营业绩',
    publisher: 'NVIDIA / 美国 SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:00:00.000Z',
    rawFact: '2025 财年收入为 1,304.97 亿美元，同比增长 114%；数据中心收入为 1,151.86 亿美元，同比增长 142%。',
  }),
  makeSource({
    id: 'src-q4-results',
    title: 'NVIDIA 2025 财年第四季度及全年业绩',
    publisher: 'NVIDIA 投资者关系',
    type: 'COMPANY_RELEASE',
    url: 'https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Announces-Financial-Results-for-Fourth-Quarter-and-Fiscal-2025/default.aspx',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:20:00.000Z',
    rawFact: '第四季度收入为 393.31 亿美元，数据中心收入为 355.80 亿美元。NVIDIA 披露，当季 Blackwell 收入为 110 亿美元。',
  }),
  makeSource({
    id: 'src-msft-q2',
    title: 'Microsoft 2025 财年第二季度业绩电话会',
    publisher: 'Microsoft 投资者关系',
    type: 'EARNINGS_CALL',
    url: 'https://www.microsoft.com/en-us/investor/events/fy-2025/earnings-fy-2025-q2',
    publishedAt: '2025-01-29T00:00:00.000Z',
    availableAt: '2025-01-29T22:30:00.000Z',
    rawFact: 'Microsoft 披露，当季资本开支（含融资租赁）为 226 亿美元，并表示其 AI 业务年化收入已超过 130 亿美元。',
  }),
  makeSource({
    id: 'src-alphabet-q4',
    title: 'Alphabet 2024 年第四季度业绩电话会',
    publisher: 'Alphabet 投资者关系',
    type: 'EARNINGS_CALL',
    url: 'https://abc.xyz/investor/events/event-details/2025/2024-Q4-Earnings-Call/',
    publishedAt: '2025-02-04T00:00:00.000Z',
    availableAt: '2025-02-04T22:00:00.000Z',
    rawFact: 'Alphabet 披露，第四季度资本开支为 140 亿美元，并预计 2025 年资本开支约为 750 亿美元，主要用于服务器和数据中心。',
  }),
  makeSource({
    id: 'src-meta-q4',
    title: 'Meta 2024 年第四季度及全年业绩',
    publisher: 'Meta 投资者关系',
    type: 'COMPANY_RELEASE',
    url: 'https://investor.atmeta.com/investor-news/press-release-details/2025/Meta-Reports-Fourth-Quarter-and-Full-Year-2024-Results/default.aspx',
    publishedAt: '2025-01-29T00:00:00.000Z',
    availableAt: '2025-01-29T21:05:00.000Z',
    rawFact: 'Meta 披露，2024 年资本开支为 392.3 亿美元，并预计 2025 年为 600 亿至 650 亿美元，增长主要来自生成式 AI 和核心业务。',
  }),
  makeSource({
    id: 'src-q4-margin',
    title: 'NVIDIA 2025 财年第四季度及全年业绩 · 毛利率指引',
    publisher: 'NVIDIA 投资者关系',
    type: 'COMPANY_RELEASE',
    url: 'https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Announces-Financial-Results-for-Fourth-Quarter-and-Fiscal-2025/default.aspx',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:20:00.000Z',
    rawFact: '第四季度 GAAP 毛利率为 73.0%，低于上一季度的 74.6%；公司预计 2026 财年第一季度 GAAP 毛利率为 70.6%，上下浮动 50 个基点。',
  }),
  makeSource({
    id: 'src-fy25-10k-concentration',
    title: 'NVIDIA 2025 财年 Form 10-K · 客户集中度',
    publisher: 'NVIDIA / 美国 SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:00:00.000Z',
    rawFact: '直接客户 A、B、C 分别占 2025 财年收入的 12%、11% 和 11%；另有一名估算的间接客户占比也至少为 10%。',
  }),
  makeSource({
    id: 'src-fy25-10k-export',
    title: 'NVIDIA 2025 财年 Form 10-K · 出口管制',
    publisher: 'NVIDIA / 美国 SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:00:00.000Z',
    rawFact: 'NVIDIA 表示，中国数据中心业务收入占比仍远低于 2023 年 10 月以前的水平，现有出口管制已经削弱了公司的竞争地位。',
  }),
  makeSource({
    id: 'src-fy25-10k-competition',
    title: 'NVIDIA 2025 财年 Form 10-K · 竞争',
    publisher: 'NVIDIA / 美国 SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm',
    publishedAt: '2025-02-26T00:00:00.000Z',
    availableAt: '2025-02-26T21:00:00.000Z',
    rawFact: 'NVIDIA 将 Alphabet、Amazon 和 Microsoft 内部的加速计算硬件团队列为竞争对手。',
  }),
  makeSource({
    id: 'src-tsmc-chips',
    title: '美国商务部敲定台积电亚利桑那州 CHIPS 奖励',
    publisher: '美国商务部',
    type: 'GOVERNMENT_RELEASE',
    url: 'https://www.commerce.gov/news/press-releases/2024/11/biden-harris-administration-announces-chips-incentives-award-tsmc',
    publishedAt: '2024-11-15T00:00:00.000Z',
    availableAt: '2024-11-15T14:00:00.000Z',
    rawFact: '美国商务部宣布，将按里程碑提供最高 66 亿美元直接资助，支持台积电在亚利桑那州三座晶圆厂超过 650 亿美元的计划投资。',
  }),
  makeSource({
    id: 'src-market-fixture',
    title: '示意用标准化价格序列',
    publisher: 'Serenity 演示数据生成器',
    type: 'MARKET_DATA',
    url: 'https://example.invalid/serenity-fixture',
    publishedAt: '2025-02-27T00:00:00.000Z',
    availableAt: '2025-02-27T00:00:00.000Z',
    rawFact: '合成的标准化指数值 [100, 106, 103, 111, 116, 114] 只用于演示确定性的收益率和移动平均线界面。',
  }),
  makeSource({
    id: 'src-h20-8k',
    title: 'NVIDIA Form 8-K · H20 出口许可要求',
    publisher: 'NVIDIA / 美国 SEC',
    type: 'SEC_FILING',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000082/nvda-20250409.htm',
    publishedAt: '2025-04-15T00:00:00.000Z',
    availableAt: '2025-04-15T21:22:59.000Z',
    rawFact: 'NVIDIA 披露，美国政府要求向中国及相关目的地出口 H20 必须取得许可，公司预计 2026 财年第一季度相关费用最高约为 55 亿美元。',
  }),
  makeSource({
    id: 'src-ai-diffusion-rule',
    title: '《人工智能扩散框架》',
    publisher: '美国商务部 / 《联邦公报》',
    type: 'GOVERNMENT_RELEASE',
    url: 'https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion',
    publishedAt: '2025-01-15T00:00:00.000Z',
    availableAt: '2025-01-15T05:00:00.000Z',
    rawFact: '该规则计划于 2025 年 5 月 15 日进入合规期，并拟对所涵盖的先进芯片实施全球许可要求。',
  }),
];

const assess = (assessment: EvidenceAssessment) => assessment;

export const nvdaEvidence: EvidenceAssessment[] = [
  assess({ id: 'ev-fy25-growth', sourceId: 'src-fy25-10k-growth', title: '数据中心业务实现了强劲增长', layer: 'FUNDAMENTALS', relation: 'SUPPORTS', confidence: 'HIGH', assumptionIds: ['assumption-demand'], interpretation: '经审计的全年业绩表明，需求判断已有实际销售支撑，并非只来自管理层预期。', limitations: '历史增长无法证明这一趋势能持续多久，也不能说明客户能从 AI 基础设施投入中取得多少回报。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-blackwell-ramp', sourceId: 'src-q4-results', title: 'Blackwell 在首个量产季度已形成可观收入', layer: 'FUNDAMENTALS', relation: 'SUPPORTS', confidence: 'HIGH', assumptionIds: ['assumption-blackwell'], interpretation: '当季披露的 110 亿美元 Blackwell 收入，降低了近期产品架构切换的风险。', limitations: '这一数字由公司披露，不能反映终端客户的实际利用率，也不能证明当前毛利率可以持续。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-microsoft-capex', sourceId: 'src-msft-q2', title: 'Microsoft 的 AI 业务开始变现，但算力仍然受限', layer: 'INFORMATION', relation: 'SUPPORTS', confidence: 'MEDIUM', assumptionIds: ['assumption-demand'], interpretation: '主要买家对订单积压、商业化进展和算力限制的说明，支持基础设施需求继续增长的判断。', limitations: '管理层表态无法说明其中有多少投入最终流向 NVIDIA。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-alphabet-capex', sourceId: 'src-alphabet-q4', title: 'Alphabet 预计将大幅增加基础设施投入', layer: 'INFORMATION', relation: 'SUPPORTS', confidence: 'MEDIUM', assumptionIds: ['assumption-demand', 'assumption-blackwell'], interpretation: '这份指引从另一家公司侧面印证了算力需求增长和 Blackwell 的实际采用。', limitations: 'Alphabet 也在部署自研 TPU；服务器和数据中心投入并不都与 AI 或 NVIDIA 有关。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-meta-capex', sourceId: 'src-meta-q4', title: 'Meta 的计划进一步印证了买家预算处于高位', layer: 'INFORMATION', relation: 'SUPPORTS', confidence: 'MEDIUM', assumptionIds: ['assumption-demand'], interpretation: '另一家主要买家提高开支计划，降低了判断对单一云厂商计划的依赖。', limitations: 'Meta 表示多数资本开支仍将服务于核心业务，不能把这些投入全部视为 NVIDIA 相关支出。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-margin-pressure', sourceId: 'src-q4-margin', title: 'Blackwell 放量正在压低毛利率', layer: 'FUNDAMENTALS', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-margin', 'assumption-blackwell'], interpretation: '收入加速的同时毛利率下滑，因此毛利率能否恢复是这项判断必须跟踪的验证点。', limitations: '新品上市阶段的系统成本可能只是暂时因素，单个指引期不足以证明毛利率会长期下滑。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-concentration', sourceId: 'src-fy25-10k-concentration', title: '少数客户关系仍占较大比重', layer: 'FUNDAMENTALS', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-demand'], interpretation: '客户集中度较高，可能放大客户议价能力和季度间的需求波动。', limitations: '终端需求归属可能与直接开票的客户关系并不一致。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-export-controls', sourceId: 'src-fy25-10k-export', title: '出口管制已经压缩市场准入空间', layer: 'INFORMATION', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-access'], interpretation: '即使 NVIDIA 的产品执行没有变化，监管限制也可能缩小可服务市场。', limitations: '对竞争地位的影响来自 NVIDIA 自身的风险披露，并非独立的市场份额测算。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-custom-silicon', sourceId: 'src-fy25-10k-competition', title: '最大的几家买家也是芯片竞争对手', layer: 'FUNDAMENTALS', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-leadership'], interpretation: 'AI 预算增加未必会按同样比例转化为 NVIDIA 收入。', limitations: '文件列出了相关竞争活动，但没有量化其工作负载份额或相对经济性。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-tsmc-resilience', sourceId: 'src-tsmc-chips', title: '美国本土先进制程产能有望逐步提高供应韧性', layer: 'FUNDAMENTALS', relation: 'NEUTRAL', confidence: 'MEDIUM', assumptionIds: ['assumption-blackwell'], interpretation: '美国新增产能有望降低长期的地域集中风险。', limitations: '项目建设需要多年，奖励文件也没有披露专门分配给 NVIDIA 的产能。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-market-context', sourceId: 'src-market-fixture', title: '仅作示意的市场背景', layer: 'MARKET', relation: 'NEUTRAL', confidence: 'LOW', assumptionIds: ['assumption-valuation'], interpretation: '这组合成序列只用于演示可重复的市场背景计算，不能支持估值结论。', limitations: '目前没有接入实时或授权的市场数据源，当前估值状态仍为未知。', assessedAt: fixtureMeta.researchAsOf }),
  assess({ id: 'ev-h20-license', sourceId: 'src-h20-8k', title: 'H20 许可要求已带来直接财务影响', layer: 'INFORMATION', relation: 'CHALLENGES', confidence: 'HIGH', assumptionIds: ['assumption-access', 'assumption-margin'], interpretation: '不设期限的许可要求和预计费用，明显削弱了市场准入假设，也增加了近期毛利率压力。', limitations: '文件披露的是预计费用；评估时，后续实际需求、许可结果和缓解措施仍不明确。', assessedAt: fixtureMeta.currentAsOf }),
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
  company: '英伟达（NVIDIA）',
  currentVersionId: 'thesis-nvda-v1',
  followed: true,
  createdAt: fixtureMeta.researchAsOf,
  updatedAt: fixtureMeta.currentAsOf,
};

const sharedThesis = {
  thesisId: nvdaThesis.id,
  causalChain: [...nvdaCausalChain],
  horizon: '12–18 个月',
  assumptionIds: nvdaAssumptions.map((item) => item.id),
  supportingEvidenceIds: nvdaEvidence.filter((item) => item.relation === 'SUPPORTS').map((item) => item.id),
  challengingEvidenceIds: nvdaEvidence.filter((item) => item.relation === 'CHALLENGES' && item.id !== 'ev-h20-license').map((item) => item.id),
  uncertainties: nvdaIdeaBreakdown.uncertainties,
  risks: nvdaIdeaBreakdown.risks,
  invalidationConditions: [
    '至少两家主要 AI 基础设施买家显著下调未来开支计划。',
    'Blackwell 收入停滞，且原因不是暂时性的供应限制。',
    '产品架构放量进入成熟阶段后，毛利率仍未恢复。',
    '出口管制或客户替代显著削弱可触达需求。',
  ],
  monitorVariables: [
    '大型云厂商的资本开支指引和 AI 算力说明',
    'Blackwell 收入、出货节奏和供应情况',
    '数据中心业务增速和毛利率变化',
    '出口管制规则、许可及相关费用',
    '主要云厂商采用自研加速器的进展',
  ],
};

export const nvdaThesisVersions: ThesisVersion[] = [
  {
    ...sharedThesis,
    id: 'thesis-nvda-v1',
    version: 1,
    state: 'STABLE',
    coreThesis: nvdaIdeaBreakdown.coreThesis,
    changedBecause: '数据中心收入与云厂商投入支撑需求仍强；但 Blackwell 切换期毛利率承压、客户自研芯片和市场准入风险都要求保留意见。',
    createdAt: fixtureMeta.researchAsOf,
    asOf: fixtureMeta.researchAsOf,
  },
];

export const currentNvdaThesisVersion = nvdaThesisVersions.at(-1)!;

export const nvdaMonitorEvents: MonitorEvent[] = [
  {
    id: 'event-h20-license',
    title: '新的 H20 出口许可要求带来直接财务影响',
    summary: 'NVIDIA 披露，向中国及相关目的地出口 H20 须取得美国许可，且要求不设期限；公司预计 2026 财年第一季度相关费用最高约为 55 亿美元。',
    occurredAt: '2025-04-15T21:22:59.000Z',
    sourceId: 'src-h20-8k',
    status: 'NEW',
    impact: {
      id: 'impact-h20-license', eventId: 'event-h20-license', thesisId: nvdaThesis.id, relation: 'CHALLENGES', materiality: 'HIGH',
      affectedAssumptionIds: ['assumption-access', 'assumption-margin'],
      explanation: '这项变化把已知的监管风险转化为立即生效的产品限制和预计财务费用。它削弱了投资论点，但仅凭这一点，还不能说明全球 AI 需求或 Blackwell 的采用趋势已经逆转。',
      stateBefore: 'STABLE', assessedAt: fixtureMeta.currentAsOf,
    },
  },
  {
    id: 'event-q1-results',
    title: '待跟踪：NVIDIA 2026 财年第一季度业绩',
    summary: '把实际收入与公司 430 亿美元、上下浮动 2% 的指引对照，并比较实际 GAAP 毛利率与 70.6%、上下浮动 50 个基点的指引。重点关注 Blackwell 收入结构及公司对毛利率恢复的表述。',
    occurredAt: '2025-05-28T20:00:00.000Z',
    sourceId: 'src-q4-results',
    status: 'UPCOMING',
    impact: {
      id: 'impact-q1-upcoming', eventId: 'event-q1-results', thesisId: nvdaThesis.id, relation: 'NEUTRAL', materiality: 'HIGH',
      affectedAssumptionIds: ['assumption-blackwell', 'assumption-margin'],
      explanation: '这将直接检验 Blackwell 快速增长能否与盈利能力企稳同时出现。本演示数据不预设结果。',
      stateBefore: 'STABLE', assessedAt: fixtureMeta.currentAsOf,
    },
  },
  {
    id: 'event-ai-diffusion',
    title: '待跟踪：《人工智能扩散框架》合规日期',
    summary: '在计划合规日期前，跟踪规则实施方式、许可指引、各国配额，以及公司对需求影响的估算。',
    occurredAt: '2025-05-15T04:00:00.000Z',
    sourceId: 'src-ai-diffusion-rule',
    status: 'UPCOMING',
    impact: {
      id: 'impact-ai-diffusion', eventId: 'event-ai-diffusion', thesisId: nvdaThesis.id, relation: 'NEUTRAL', materiality: 'MEDIUM',
      affectedAssumptionIds: ['assumption-access'],
      explanation: '该规则可能改变国际市场准入条件，但在跟踪截止时，实际影响仍不明确。',
      stateBefore: 'STABLE', assessedAt: fixtureMeta.currentAsOf,
    },
  },
];

export const normalizedMarketSeries = [100, 106, 103, 111, 116, 114] as const;

export const nvdaSourcesById = Object.fromEntries(nvdaSources.map((item) => [item.id, item])) as Record<string, SourceRecord>;
export const nvdaAssumptionsById = Object.fromEntries(nvdaAssumptions.map((item) => [item.id, item])) as Record<string, Assumption>;
export const nvdaEvidenceById = Object.fromEntries(nvdaEvidence.map((item) => [item.id, item])) as Record<string, EvidenceAssessment>;
