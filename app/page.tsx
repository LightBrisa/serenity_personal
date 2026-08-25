import Link from 'next/link';
import { ArrowRight, Clock3, SearchCheck, ShieldCheck, Sparkles, Telescope } from 'lucide-react';
import { IdeaCapture } from '@/src/components/idea-capture';
import { FixtureNotice, RelationBadge, StateBadge } from '@/src/components/ui';
import { relationCounts } from '@/src/domain/calculations';
import {
  currentNvdaThesisVersion,
  nvdaEvidence,
  nvdaMonitorEvents,
  nvdaThesis,
} from '@/src/data/nvda-fixtures';

export default function Home() {
  const counts = relationCounts(nvdaEvidence);
  const latestEvent = nvdaMonitorEvents[0];

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-9 sm:px-8 lg:px-10 lg:pt-12">
      <FixtureNotice compact />

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_306px]">
        <section>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6d786f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cf8d45]" /> Start a new thesis
          </p>
          <h1 className="max-w-2xl font-serif text-[clamp(2.25rem,4vw,3.85rem)] leading-[1.02] tracking-[-0.035em] text-[#17251f]">
            What idea are you investigating?
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#68716b]">
            Paste a claim from anywhere, or enter a ticker. Serenity will surface the assumptions, contradictory evidence, and questions that matter before forming a conclusion.
          </p>
          <IdeaCapture />
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[#7b837e]">
            <span className="mr-1">Try another ticker</span>
            {['MSFT', 'AMZN', 'META'].map((ticker) => (
              <button key={ticker} type="button" title="Additional tickers arrive after the NVDA vertical slice" className="rounded-full border border-[#d7dad4] bg-[#f8f8f4] px-3 py-1.5 font-semibold text-[#59655e] transition hover:border-[#acb8ae]">
                {ticker}
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-[22px] border border-[#d9ddd5] bg-[#e9ece6] p-5 xl:mt-7">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f7972]">How Serenity works</p>
            <Sparkles size={15} className="text-[#819087]" />
          </div>
          <ol className="mt-6 space-y-5">
            {[
              { index: '01', title: 'Clarify the claim', copy: 'Turn the idea into an editable, falsifiable hypothesis.', icon: SearchCheck },
              { index: '02', title: 'Investigate both sides', copy: 'Seek supporting evidence and credible contradictions.', icon: ShieldCheck },
              { index: '03', title: 'Track what matters', copy: 'Monitor assumptions and invalidation conditions—not every headline.', icon: Telescope },
            ].map(({ index, title, copy, icon: Icon }) => (
              <li key={index} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#d6dbd3] bg-[#f7f7f3] text-[#52685a]"><Icon size={14} /></span>
                <div>
                  <p className="text-sm font-semibold text-[#2d3932]">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#747d77]">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 border-t border-[#d4d9d1] pt-4 text-[11px] leading-5 text-[#747d77]">
            No scores. No buy/sell signal. Every state change points back to evidence.
          </div>
        </aside>
      </div>

      <section className="mt-14 border-t border-[#d9ddd5] pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7d857f]">Following</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">Active investment thesis</h2>
          </div>
          <Link href="/thesis/nvda" className="text-xs font-semibold text-[#315d47] hover:underline">Open thesis <span aria-hidden="true">→</span></Link>
        </div>

        <Link href="/thesis/nvda" className="mt-5 grid gap-5 rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 transition hover:-translate-y-0.5 hover:border-[#bec7be] hover:shadow-[0_12px_30px_rgb(48_60_52/6%)] sm:grid-cols-[190px_minmax(0,1fr)_190px] sm:p-6">
          <div className="flex items-center gap-3 sm:border-r sm:border-[#e0e3dd]">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e0e8de] text-sm font-bold text-[#28533f]">NV</span>
            <div>
              <p className="font-semibold">{nvdaThesis.company.replace(' Corporation', '')}</p>
              <p className="text-xs text-[#7c857f]">NASDAQ · {nvdaThesis.ticker}</p>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StateBadge state={currentNvdaThesisVersion.state} />
              <span className="flex items-center gap-1 text-[11px] text-[#8a918c]"><Clock3 size={11} /> Version 2 · Apr 16, 2025</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#38453e]">{currentNvdaThesisVersion.coreThesis}</p>
          </div>
          <div className="flex items-center gap-5 sm:justify-end">
            <div><p className="text-lg font-semibold text-[#3b694f]">{counts.SUPPORTS}</p><p className="text-[10px] uppercase tracking-[0.09em] text-[#818984]">Supports</p></div>
            <div><p className="text-lg font-semibold text-[#9a6748]">{counts.CHALLENGES}</p><p className="text-[10px] uppercase tracking-[0.09em] text-[#818984]">Challenges</p></div>
            <ArrowRight size={16} className="hidden text-[#859088] sm:block" />
          </div>
        </Link>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <Link href="/monitor/nvda" className="group rounded-[20px] border border-[#dfd7cb] bg-[#f8f2e9] p-5 transition hover:border-[#cebda7] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><RelationBadge relation={latestEvent.impact.relation} /><span className="text-[11px] text-[#8a8176]">High materiality · new thesis version</span></div>
            <span className="text-xs font-semibold text-[#8a6541] group-hover:underline">Review impact →</span>
          </div>
          <h3 className="mt-4 max-w-3xl text-base font-semibold text-[#3a342d]">{latestEvent.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#716960]">{latestEvent.impact.explanation}</p>
        </Link>
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#f8f8f4] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#858d87]">Next catalyst</p>
          <p className="mt-3 text-sm font-semibold text-[#36433b]">Q1 FY2026 results</p>
          <p className="mt-2 text-xs leading-5 text-[#7b837e]">Test Blackwell growth against margin recovery.</p>
          <p className="mt-4 text-[11px] font-semibold text-[#52685a]">Scheduled in fixture · May 28</p>
        </div>
      </section>
    </div>
  );
}
