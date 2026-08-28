import { AlertOctagon, ArrowRight, CalendarDays, CircleHelp, Eye, History, Lightbulb, ShieldAlert } from 'lucide-react';
import { CausalChain } from '@/src/components/causal-chain';
import { ActiveThesisBody, CurrentThesisStatement, ThesisDecisionCard, ThesisDecisionStatus, ThesisPageIntro } from '@/src/components/decision-experience';
import { SafeLink as Link } from '@/src/components/safe-link';
import { AssumptionStatus, FixtureNotice, RelationBadge, SourceTypeLabel, Unknown } from '@/src/components/ui';
import {
  currentNvdaThesisVersion,
  nvdaAssumptions,
  nvdaEvidenceById,
  nvdaSourcesById,
  nvdaThesis,
} from '@/src/data/nvda-fixtures';

function EvidenceMiniCard({ evidenceId }: { evidenceId: string }) {
  const evidence = nvdaEvidenceById[evidenceId];
  const source = nvdaSourcesById[evidence.sourceId];
  return (
    <article className="rounded-xl border border-[#dfe2dc] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><RelationBadge relation={evidence.relation} /><SourceTypeLabel type={source.type} /></div>
      <p className="mt-3 text-sm font-semibold leading-5 text-[#3c4841]">{evidence.title}</p>
      <p className="mt-2 text-xs leading-5 text-[#727b75]">{evidence.interpretation}</p>
      <a href={source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-[11px] font-semibold text-[#315d47] hover:underline">{source.publisher} ↗</a>
    </article>
  );
}

export default function ThesisCardPage() {
  const supportIds = ['ev-fy25-growth', 'ev-blackwell-ramp'];
  const challengeIds = ['ev-margin-pressure', 'ev-custom-silicon'];

  return (
    <div className="mx-auto max-w-[1160px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <ThesisPageIntro />
        <FixtureNotice compact />
      </div>

      <article className="mt-8 overflow-hidden rounded-[24px] border border-[#cfd6ce] bg-[#fafaf7] shadow-[0_20px_60px_rgb(48_60_52/7%)]">
        <header className="border-b border-[#dbe0d9] bg-[#eef2eb] p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#dbe7da] text-lg font-bold text-[#28533f]">NV</span>
              <div><h2 className="text-xl font-semibold tracking-[-0.02em]">{nvdaThesis.company}</h2><p className="mt-1 text-xs text-[#758079]">纳斯达克 · {nvdaThesis.ticker} · 我想看 12–18 个月</p></div>
            </div>
            <ThesisDecisionStatus fallbackState={currentNvdaThesisVersion.state} />
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <CurrentThesisStatement coreThesis={currentNvdaThesisVersion.coreThesis} />
            <ThesisDecisionCard />
          </div>
        </header>

        <ActiveThesisBody>
          <div className="p-5 sm:p-7">
          <section className="grid gap-6 xl:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#59715f]"><Lightbulb size={13} />我为什么这样判断</div>
              <h3 className="mt-2 text-lg font-semibold">最有力的两条依据</h3>
              <div className="mt-4 space-y-3">{supportIds.map((id) => <EvidenceMiniCard key={id} evidenceId={id} />)}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8e5e48]"><ShieldAlert size={13} />哪些事实让我犹豫</div>
              <h3 className="mt-2 text-lg font-semibold">最重要的两条反证</h3>
              <div className="mt-4 space-y-3">{challengeIds.map((id) => <EvidenceMiniCard key={id} evidenceId={id} />)}</div>
            </div>
          </section>

          <section className="mt-8 grid gap-5 border-t border-[#e0e3dd] pt-7 lg:grid-cols-3">
            <div className="rounded-[18px] border border-[#e2d0ca] bg-[#f6ebe6] p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8e5a48]"><AlertOctagon size={13} />出现什么，我就得改判断</div>
              <ul className="mt-4 space-y-3">{currentNvdaThesisVersion.invalidationConditions.slice(0, 3).map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-[#71635d]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b2765c]" />{item}</li>)}</ul>
            </div>
            <div className="rounded-[18px] border border-[#d8ded6] bg-[#edf1eb] p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#58705f]"><Eye size={13} />以后重点看什么</div>
              <ul className="mt-4 space-y-3">{currentNvdaThesisVersion.monitorVariables.slice(0, 3).map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-[#647069]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#718c78]" />{item}</li>)}</ul>
            </div>
            <div className="rounded-[18px] border border-[#d9ddd5] bg-[#f5f6f2] p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><CircleHelp size={13} />我还不知道什么</div>
              <p className="mt-4 text-sm leading-6 text-[#59655e]">在接入可信的实时市场数据前，当前估值和市场预期仍为 <Unknown />。</p>
            </div>
          </section>

          <details className="group mt-8 rounded-[18px] border border-[#d9ddd5] bg-[#f5f6f2] p-5">
            <summary className="cursor-pointer list-none marker:hidden"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">需要时再看</p><h3 className="mt-2 text-base font-semibold">这条判断是怎么成立的</h3></div><span className="text-xs font-semibold text-[#315d47] group-open:hidden">展开完整逻辑</span><span className="hidden text-xs font-semibold text-[#315d47] group-open:inline">收起</span></div></summary>
            <div className="mt-6"><CausalChain steps={currentNvdaThesisVersion.causalChain} /></div>
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {nvdaAssumptions.map((assumption) => <div key={assumption.id} className="rounded-xl border border-[#dfe2dc] bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[9px] font-bold tracking-[0.06em] text-[#9a9f9b]">它成立，需要满足</span><AssumptionStatus status={assumption.status} /></div><p className="mt-3 text-sm font-semibold leading-5 text-[#3b4740]">{assumption.statement}</p><p className="mt-2 text-xs leading-5 text-[#7a837d]">{assumption.rationale}</p></div>)}
            </div>
            <Link href="/research/nvda" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#315d47] hover:underline">查看全部原始依据 <ArrowRight size={12} /></Link>
          </details>
          </div>
        </ActiveThesisBody>

        <footer className="flex flex-col gap-4 border-t border-[#dbe0d9] bg-[#f1f3ee] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3 text-xs text-[#738078]"><CalendarDays size={15} /><span>第一次写下于 2025 年 2 月 27 日 · 当时的材料仍保留</span></div>
          <Link href="/thesis/nvda/history" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd2ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#315d47] transition hover:border-[#9fac9f]"><History size={14} />看看我之前怎么想</Link>
        </footer>
      </article>
    </div>
  );
}
