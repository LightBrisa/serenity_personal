import Link from 'next/link';
import { AlertOctagon, ArrowRight, CalendarDays, ClipboardList, Eye, History, Scale, ShieldAlert } from 'lucide-react';
import { CausalChain } from '@/src/components/causal-chain';
import { FollowControl } from '@/src/components/follow-control';
import { JourneyProgress } from '@/src/components/journey-progress';
import { AssumptionStatus, FixtureNotice, RelationBadge, StateBadge, Unknown } from '@/src/components/ui';
import { relationCounts } from '@/src/domain/calculations';
import {
  currentNvdaThesisVersion,
  nvdaAssumptions,
  nvdaEvidence,
  nvdaEvidenceById,
  nvdaSourcesById,
  nvdaThesis,
} from '@/src/data/nvda-fixtures';

function EvidenceMiniCard({ evidenceId }: { evidenceId: string }) {
  const evidence = nvdaEvidenceById[evidenceId];
  const source = nvdaSourcesById[evidence.sourceId];
  return (
    <article className="rounded-xl border border-[#dfe2dc] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><RelationBadge relation={evidence.relation} /><span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#909791]">{source.type.replace('_', ' ')}</span></div>
      <p className="mt-3 text-sm font-semibold leading-5 text-[#3c4841]">{evidence.title}</p>
      <p className="mt-2 text-xs leading-5 text-[#727b75]">{evidence.interpretation}</p>
      <a href={source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-[11px] font-semibold text-[#315d47] hover:underline">{source.publisher} ↗</a>
    </article>
  );
}

export default function ThesisCardPage() {
  const counts = relationCounts(nvdaEvidence);
  const supportIds = currentNvdaThesisVersion.supportingEvidenceIds.slice(0, 3);
  const challengeIds = currentNvdaThesisVersion.challengingEvidenceIds.slice(-4);

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-7 sm:px-8 lg:px-10">
      <JourneyProgress current="Thesis" />
      <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7c857f]">NVDA · Investment thesis · Version 2</p>
          <h1 className="mt-3 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">The case, the caveats, and what would change our mind.</h1>
        </div>
        <FixtureNotice compact />
      </div>

      <article className="mt-8 overflow-hidden rounded-[24px] border border-[#cfd6ce] bg-[#fafaf7] shadow-[0_20px_60px_rgb(48_60_52/7%)]">
        <header className="border-b border-[#dbe0d9] bg-[#eef2eb] p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#dbe7da] text-lg font-bold text-[#28533f]">NV</span>
              <div><h2 className="text-xl font-semibold tracking-[-0.02em]">{nvdaThesis.company}</h2><p className="mt-1 text-xs text-[#758079]">NASDAQ · {nvdaThesis.ticker} · 12–18 month horizon</p></div>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end"><StateBadge state={currentNvdaThesisVersion.state} large /><p className="text-[11px] text-[#7c857f]">Last re-evaluated Apr 16, 2025 · 12:00 UTC</p></div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#64766a]">Core thesis</p><p className="mt-3 font-serif text-[clamp(1.35rem,2.5vw,2rem)] leading-[1.35] tracking-[-0.02em] text-[#2b3931]">{currentNvdaThesisVersion.coreThesis}</p></div>
            <div className="rounded-2xl border border-[#dacda9] bg-[#f5ead5] p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a642f]"><Eye size={13} /> Why WATCH</div><p className="mt-2 text-xs leading-5 text-[#776449]">The H20 restriction converted a known regulatory risk into an immediate product constraint and expected charge. Core AI demand evidence remains intact.</p></div>
          </div>
        </header>

        <div className="p-5 sm:p-7">
          <section><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#7d857f]">How the thesis works</p><h3 className="mt-2 text-lg font-semibold">Causal chain</h3></div><span className="hidden text-[11px] text-[#8a918c] sm:block">Every link is monitored</span></div><div className="mt-5"><CausalChain steps={currentNvdaThesisVersion.causalChain} /></div></section>

          <section className="mt-8 border-t border-[#e0e3dd] pt-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#7d857f]">What must remain true</p><h3 className="mt-2 text-lg font-semibold">Key assumptions</h3></div><p className="text-[11px] text-[#8a918c]">Status is evidence-led, not scored</p></div>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {nvdaAssumptions.map((assumption) => (
                <div key={assumption.id} className="rounded-xl border border-[#dfe2dc] bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9a9f9b]">{assumption.importance} assumption</span><AssumptionStatus status={assumption.status} /></div><p className="mt-3 text-sm font-semibold leading-5 text-[#3b4740]">{assumption.statement}</p><p className="mt-2 text-xs leading-5 text-[#7a837d]">{assumption.rationale}</p><p className="mt-3 text-[10px] font-semibold text-[#6c786f]">{assumption.evidenceIds.length} linked evidence item{assumption.evidenceIds.length === 1 ? '' : 's'}</p></div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div><div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#59715f]">Supporting evidence</p><h3 className="mt-2 text-lg font-semibold">What strengthens the case</h3></div><span className="text-lg font-semibold text-[#3b694f]">{counts.SUPPORTS}</span></div><div className="mt-4 space-y-3">{supportIds.map((id) => <EvidenceMiniCard key={id} evidenceId={id} />)}</div><Link href="/research/nvda" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#315d47] hover:underline">View full evidence ledger <ArrowRight size={12} /></Link></div>
            <div><div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#8e5e48]">Challenging evidence</p><h3 className="mt-2 text-lg font-semibold">What weakens the case</h3></div><span className="text-lg font-semibold text-[#9a6748]">{counts.CHALLENGES}</span></div><div className="mt-4 space-y-3">{challengeIds.map((id) => <EvidenceMiniCard key={id} evidenceId={id} />)}</div></div>
          </section>

          <section className="mt-8 grid gap-5 border-t border-[#e0e3dd] pt-7 lg:grid-cols-3">
            <div className="rounded-[18px] border border-[#e0d7ca] bg-[#f8f2e9] p-5"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a6844]"><Scale size={13} /> Risks</div><ul className="mt-4 space-y-3">{currentNvdaThesisVersion.risks.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-[#716960]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b58455]" />{item}</li>)}</ul></div>
            <div className="rounded-[18px] border border-[#e2d0ca] bg-[#f6ebe6] p-5"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8e5a48]"><AlertOctagon size={13} /> Invalidation conditions</div><ul className="mt-4 space-y-3">{currentNvdaThesisVersion.invalidationConditions.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-[#71635d]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b2765c]" />{item}</li>)}</ul></div>
            <div className="rounded-[18px] border border-[#d8ded6] bg-[#edf1eb] p-5"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#58705f]"><Eye size={13} /> Variables to monitor</div><ul className="mt-4 space-y-3">{currentNvdaThesisVersion.monitorVariables.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-[#647069]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#718c78]" />{item}</li>)}</ul></div>
          </section>

          <section className="mt-7 rounded-[18px] border border-[#d9ddd5] bg-[#f5f6f2] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]"><ShieldAlert size={13} /> Important uncertainty</div><p className="mt-2 text-sm text-[#59655e]">Current live valuation and expectations are <Unknown /> until a trusted market-data provider is connected.</p></div><Link href="/thesis/nvda/history" className="inline-flex min-w-max items-center gap-2 text-xs font-semibold text-[#315d47] hover:underline"><History size={14} /> View version history</Link></div>
          </section>
        </div>

        <footer className="flex flex-col gap-4 border-t border-[#dbe0d9] bg-[#f1f3ee] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3 text-xs text-[#738078]"><CalendarDays size={15} /><span>Created Feb 27, 2025 · Evidence snapshot preserved</span></div>
          <FollowControl defaultFollowing={nvdaThesis.followed} />
        </footer>
      </article>

      <div className="mt-6 flex justify-center"><Link href="/thesis/nvda/history" className="inline-flex items-center gap-2 rounded-xl border border-[#d2d7d0] bg-[#f8f8f4] px-4 py-2.5 text-xs font-semibold text-[#5f6b63] transition hover:border-[#aeb9af]"><ClipboardList size={14} /> Open investment decision journal</Link></div>
    </div>
  );
}
