import Link from 'next/link';
import { ArrowRight, Check, CircleHelp, Clock3, Database, FileCheck2, Search, Sparkles, TriangleAlert } from 'lucide-react';
import { EvidenceLedger } from '@/src/components/evidence-ledger';
import { JourneyProgress } from '@/src/components/journey-progress';
import { FixtureNotice, Unknown, layerLabels } from '@/src/components/ui';
import { percentChange, relationCounts, simpleMovingAverage } from '@/src/domain/calculations';
import {
  fixtureMeta,
  normalizedMarketSeries,
  nvdaEvidence,
  nvdaIdeaBreakdown,
  nvdaResearchQuestions,
  nvdaResearchRun,
  nvdaSources,
} from '@/src/data/nvda-fixtures';

const stages = [
  { label: '解析观点', icon: FileCheck2 },
  { label: '制定计划', icon: CircleHelp },
  { label: '收集证据', icon: Search },
  { label: '统一整理', icon: Database },
  { label: '评估影响', icon: Sparkles },
];

const questionStatusLabels = {
  ANSWERED: '已回答',
  PARTIAL: '部分回答',
  OPEN: '待研究',
} as const;

export default function ResearchWorkspacePage() {
  const researchEvidence = nvdaEvidence.filter((item) => nvdaResearchRun.evidenceIds.includes(item.id));
  const counts = relationCounts(researchEvidence);
  const marketReturn = percentChange(normalizedMarketSeries[0], normalizedMarketSeries.at(-1)!);
  const movingAverage = simpleMovingAverage([...normalizedMarketSeries], 3).at(-1)!;

  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-7 sm:px-8 lg:px-10">
      <JourneyProgress current="研究" />
      <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#7c857f]"><span>NVDA · 本轮研究</span><span className="text-[#b3b7b3]">/</span><span>截至 2025 年 2 月 27 日</span></div>
          <h1 className="mt-3 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">研究围绕论点展开，而不只看股票代码。</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#6f7872]">每条证据都对应一项假设；来源事实和研究解读分开呈现。</p>
        </div>
        <FixtureNotice compact />
      </div>

      <section className="mt-8 rounded-[20px] border border-[#cfd8cf] bg-[#edf2eb] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl"><p className="text-[10px] font-bold tracking-[0.08em] text-[#5d7665]">当前研究假设</p><p className="mt-3 text-base font-semibold leading-7 text-[#304039]">{nvdaIdeaBreakdown.coreThesis}</p></div>
          <Link href="/idea/nvda" className="min-w-max text-xs font-semibold text-[#315d47] hover:underline">编辑假设</Link>
        </div>
      </section>

      <section className="mt-5 overflow-x-auto rounded-[18px] border border-[#d9ddd5] bg-[#f8f8f4] p-4">
        <div className="flex min-w-[650px] items-center">
          {stages.map(({ label, icon: Icon }, index) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#dfeadf] text-[#426650]"><Icon size={13} /></span><div><p className="text-[10px] font-bold tracking-[0.05em] text-[#546158]">{label}</p><p className="flex items-center gap-1 text-[9px] text-[#7c867f]"><Check size={9} />已完成</p></div></div>
              {index < stages.length - 1 && <span className="mx-4 h-px flex-1 bg-[#cdd8cd]" />}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">证据清单</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">本轮研究结果</h2></div>
            <div className="flex gap-4 text-center"><div><p className="text-lg font-semibold text-[#3b694f]">{counts.SUPPORTS}</p><p className="text-[9px] tracking-[0.06em] text-[#8a918c]">支持</p></div><div><p className="text-lg font-semibold text-[#9a6748]">{counts.CHALLENGES}</p><p className="text-[9px] tracking-[0.06em] text-[#8a918c]">削弱</p></div><div><p className="text-lg font-semibold text-[#747d77]">{counts.NEUTRAL}</p><p className="text-[9px] tracking-[0.06em] text-[#8a918c]">中性</p></div></div>
          </div>
          <EvidenceLedger evidence={researchEvidence} sources={nvdaSources} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 xl:sticky xl:top-24">
            <div className="flex items-center justify-between"><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">问题进度</p><span className="rounded-full bg-[#e5ebe3] px-2 py-1 text-[10px] font-bold text-[#4b6856]">7 个问题</span></div>
            <div className="mt-4 space-y-4">
              {nvdaResearchQuestions.map((question) => {
                const statusStyle = question.status === 'ANSWERED' ? 'bg-[#dfeadf] text-[#3f684d]' : question.status === 'PARTIAL' ? 'bg-[#f4ead8] text-[#8a672f]' : 'bg-[#eceee9] text-[#747d77]';
                return <div key={question.id} className="border-b border-[#e4e6e1] pb-4 last:border-0 last:pb-0"><div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold leading-5 text-[#3e4a43]">{question.question}</p><span className={`min-w-max rounded-full px-2 py-1 text-[8px] font-bold tracking-[0.05em] ${statusStyle}`}>{questionStatusLabels[question.status]}</span></div><p className="mt-1.5 text-[9px] font-bold tracking-[0.06em] text-[#9a9f9b]">{layerLabels[question.layer]}</p></div>;
              })}
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">市场与技术面背景</p><h2 className="mt-2 text-lg font-semibold">归一化趋势示意</h2></div><Unknown>未接入实时数据源</Unknown></div>
          <div className="mt-6 flex h-28 items-end gap-2 rounded-xl border border-[#e1e4de] bg-white px-4 pb-4 pt-5">
            {normalizedMarketSeries.map((value, index) => <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] font-semibold text-[#8b928d]">{value}</span><span className="w-full max-w-12 rounded-t bg-[#8da291]" style={{ height: `${Math.max(14, (value - 90) * 3)}px`, opacity: 0.45 + index * 0.08 }} /></div>)}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center"><div className="rounded-xl bg-[#f0f2ed] p-3"><p className="text-base font-semibold text-[#3c5144]">+{marketReturn.toFixed(1)}%</p><p className="mt-1 text-[9px] tracking-[0.06em] text-[#878f89]">演示区间涨幅</p></div><div className="rounded-xl bg-[#f0f2ed] p-3"><p className="text-base font-semibold text-[#3c5144]">{movingAverage.toFixed(1)}</p><p className="mt-1 text-[9px] tracking-[0.06em] text-[#878f89]">3 点移动平均</p></div><div className="rounded-xl bg-[#f0f2ed] p-3"><p className="text-base font-semibold text-[#747d77]">未知</p><p className="mt-1 text-[9px] tracking-[0.06em] text-[#878f89]">实时估值</p></div></div>
          <p className="mt-3 text-[10px] leading-4 text-[#8b928d]">数据基于合成指数值，由 TypeScript 按固定逻辑计算。此图仅用于界面演示，不是 NVDA 历史价格。</p>
        </div>
        <div className="rounded-[20px] border border-[#dfd7cb] bg-[#f8f2e9] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8a6844]"><TriangleAlert size={13} /> 形成明确判断前仍需确认</div>
          <ul className="mt-4 space-y-3 text-xs leading-5 text-[#716960]"><li>• Blackwell 产品组合稳定后，毛利率能否恢复。</li><li>• 大型云厂商的自研芯片会在多大程度上替代通用加速卡。</li><li>• 当前估值是否已经计入持续高增长预期。</li></ul>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/60 p-3 text-[11px] leading-4 text-[#766c61]"><Clock3 size={13} className="shrink-0" /> 研究截止时间：{new Date(fixtureMeta.researchAsOf).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</div>
        </div>
      </section>

      <section className="mt-7 flex flex-col gap-4 rounded-[20px] border border-[#cbd6cc] bg-[#eaf0e8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-sm font-semibold text-[#314138]">证据已经整理并评估。</p><p className="mt-1 text-xs leading-5 text-[#6c786f]">依据现有证据整理投资论点，同时保留尚未解决的问题。</p></div>
        <Link href="/thesis/nvda" className="inline-flex min-w-max items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgb(23_62_50/18%)] transition hover:bg-[#214c3e]">整理为论点卡 <ArrowRight size={15} /></Link>
      </section>
    </div>
  );
}
