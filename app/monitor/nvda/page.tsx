import Link from 'next/link';
import { ArrowRight, CalendarClock, Check, ExternalLink, Eye, FilterX, History, Radar, ShieldAlert, Sparkles } from 'lucide-react';
import { JourneyProgress } from '@/src/components/journey-progress';
import { AssumptionStatus, FixtureNotice, RelationBadge, SourceTypeLabel, StateBadge } from '@/src/components/ui';
import {
  currentNvdaThesisVersion,
  nvdaAssumptionsById,
  nvdaMonitorEvents,
  nvdaSourcesById,
} from '@/src/data/nvda-fixtures';

export default function ThesisMonitorPage() {
  const primaryEvent = nvdaMonitorEvents[0];
  const primarySource = nvdaSourcesById[primaryEvent.sourceId];
  const upcoming = nvdaMonitorEvents.filter((event) => event.status === 'UPCOMING');

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-7 sm:px-8 lg:px-10">
      <JourneyProgress current="Monitor" />
      <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7c857f]">NVDA · Thesis monitor</p>
          <h1 className="mt-3 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">Fewer events. More meaning.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">Serenity surfaces an event only when it affects a named assumption, invalidation condition, or planned thesis checkpoint.</p>
        </div>
        <FixtureNotice compact />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[22px] border border-[#d8c9a9] bg-[#f5ead5] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a642f]"><Radar size={14} /> Current thesis state</div><span className="text-[11px] text-[#88775e]">Re-evaluated Apr 16, 2025</span></div>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div><StateBadge state={currentNvdaThesisVersion.state} large /><p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f604b]">AI infrastructure demand evidence still supports the case. Market access and near-term economics now require closer observation.</p></div>
            <Link href="/thesis/nvda" className="inline-flex min-w-max items-center gap-2 text-xs font-semibold text-[#7b5d31] hover:underline">Open thesis card <ArrowRight size={13} /></Link>
          </div>
        </div>
        <div className="rounded-[22px] border border-[#d9ddd5] bg-[#f8f8f4] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]">Monitor status</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center"><div><p className="text-xl font-semibold text-[#925b3e]">1</p><p className="mt-1 text-[9px] uppercase tracking-[0.07em] text-[#8a918c]">Impact</p></div><div><p className="text-xl font-semibold text-[#516b59]">2</p><p className="mt-1 text-[9px] uppercase tracking-[0.07em] text-[#8a918c]">Upcoming</p></div><div><p className="text-xl font-semibold text-[#6f7772]">5</p><p className="mt-1 text-[9px] uppercase tracking-[0.07em] text-[#8a918c]">Variables</p></div></div>
          <p className="mt-4 border-t border-[#e1e4de] pt-3 text-[10px] leading-4 text-[#858d87]">Scheduled monitoring is a deterministic demo; no background job is running.</p>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main>
          <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#7d857f]">Material thesis impacts</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">What changed</h2></div><span className="text-[11px] text-[#8a918c]">1 event surfaced</span></div>

          <article className="mt-4 overflow-hidden rounded-[22px] border border-[#e0c8b9] bg-[#faf7f3]">
            <div className="border-b border-[#e7d8ce] bg-[#f3e7df] p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><RelationBadge relation={primaryEvent.impact.relation} /><span className="rounded-full bg-[#ead6ca] px-2.5 py-1 text-[10px] font-bold tracking-[0.07em] text-[#8e5a43]">HIGH MATERIALITY</span><span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-[#7d6b61]">Reviewed</span></div><span className="text-[11px] text-[#8a817b]">Apr 15, 2025 · 21:22 UTC</span></div>
              <h3 className="mt-4 max-w-3xl text-xl font-semibold leading-7 tracking-[-0.02em] text-[#3c302a]">{primaryEvent.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#71635c]">{primaryEvent.summary}</p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#dfe2dc] bg-white p-5"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6f7972]"><Eye size={13} /> Why this matters</div><p className="mt-3 text-sm leading-6 text-[#536058]">{primaryEvent.impact.explanation}</p></div>
                <div className="rounded-2xl border border-[#e0d2c9] bg-[#f7eee8] p-5"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8e5e48]"><ShieldAlert size={13} /> Affected assumptions</div><div className="mt-4 space-y-3">{primaryEvent.impact.affectedAssumptionIds.map((id) => { const assumption = nvdaAssumptionsById[id]; return <div key={id} className="rounded-xl bg-white/70 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold text-[#51453f]">{assumption.statement}</p><AssumptionStatus status={assumption.status} /></div></div>; })}</div></div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#d9ddd5] bg-[#f5f6f2] p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]">Explainable state change</p><div className="mt-3 flex items-center gap-3"><StateBadge state={primaryEvent.impact.stateBefore} /><ArrowRight size={15} className="text-[#8a918c]" /><StateBadge state={primaryEvent.impact.stateAfter} /></div></div>
                  <div className="max-w-md text-xs leading-5 text-[#747d77]"><strong className="text-[#4d5951]">Why not invalidated?</strong> The event affects market access and near-term margins, but does not disprove global AI demand or Blackwell adoption.</div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-[#e1e4de] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2"><SourceTypeLabel type={primarySource.type} /><span className="text-[11px] font-semibold text-[#5f6962]">{primarySource.publisher}</span></div>
                <a href={primarySource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#315d47] hover:underline">Open SEC filing <ExternalLink size={11} /></a>
              </div>
            </div>
          </article>
        </main>

        <aside className="space-y-5">
          <section className="rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]"><CalendarClock size={13} /> Upcoming thesis checks</div>
            <div className="mt-4 space-y-4">{upcoming.map((event) => <div key={event.id} className="border-b border-[#e2e4df] pb-4 last:border-0 last:pb-0"><div className="flex items-center justify-between gap-2"><span className="rounded-full bg-[#e7ece5] px-2 py-1 text-[9px] font-bold text-[#52685a]">UPCOMING</span><span className="text-[10px] text-[#8d948f]">{new Date(event.occurredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</span></div><p className="mt-3 text-sm font-semibold leading-5 text-[#3c4841]">{event.title.replace('Upcoming: ', '')}</p><p className="mt-2 text-xs leading-5 text-[#7a837d]">{event.impact.explanation}</p></div>)}</div>
          </section>

          <section className="rounded-[20px] border border-[#d7ddd6] bg-[#edf1eb] p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#58705f]"><FilterX size={13} /> Noise policy</div>
            <p className="mt-3 text-xs leading-5 text-[#66726a]">Hidden by default unless tied to an assumption:</p>
            <ul className="mt-3 space-y-2 text-xs text-[#737e76]"><li className="flex gap-2"><Check size={12} className="mt-0.5 text-[#68806e]" />Routine price commentary</li><li className="flex gap-2"><Check size={12} className="mt-0.5 text-[#68806e]" />Unverified social speculation</li><li className="flex gap-2"><Check size={12} className="mt-0.5 text-[#68806e]" />Duplicate headline coverage</li></ul>
          </section>

          <Link href="/thesis/nvda/history" className="group block rounded-[20px] border border-[#d9ddd5] bg-[#f8f8f4] p-5 transition hover:border-[#bfc7bf]"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e4e9e2] text-[#52685a]"><History size={16} /></span><ArrowRight size={14} className="text-[#879088] transition group-hover:translate-x-1" /></div><p className="mt-4 text-sm font-semibold text-[#3c4841]">See what changed over time</p><p className="mt-1 text-xs leading-5 text-[#7a837d]">Compare the original thesis with Version 2.</p></Link>
        </aside>
      </div>

      <section className="mt-8 flex flex-col gap-4 rounded-[20px] border border-[#cbd6cc] bg-[#eaf0e8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#58705f]"><Sparkles size={13} /> Re-evaluation complete</div><p className="mt-2 text-sm font-semibold text-[#344039]">A new thesis version was created without overwriting the original.</p></div><Link href="/thesis/nvda/history" className="inline-flex min-w-max items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]">Review version history <ArrowRight size={15} /></Link></section>
    </div>
  );
}
