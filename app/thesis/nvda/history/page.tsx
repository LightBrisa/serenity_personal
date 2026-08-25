import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, FilePlus2, GitCompareArrows, History, ShieldAlert } from 'lucide-react';
import { FixtureNotice, RelationBadge, StateBadge } from '@/src/components/ui';
import {
  nvdaEvidenceById,
  nvdaSourcesById,
  nvdaThesisVersions,
} from '@/src/data/nvda-fixtures';

export default function ThesisHistoryPage() {
  const [original, current] = nvdaThesisVersions;
  const addedEvidenceIds = current.challengingEvidenceIds.filter((id) => !original.challengingEvidenceIds.includes(id));

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><Link href="/thesis/nvda" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315d47] hover:underline"><ArrowLeft size={13} /> Back to thesis card</Link><p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7c857f]">NVDA · Decision journal</p><h1 className="mt-3 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">What changed—and why.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">Each thesis version preserves the belief, evidence, and research cutoff that existed at the time.</p></div>
        <FixtureNotice compact />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]"><GitCompareArrows size={14} /> Version comparison</div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-xl border border-[#dce1da] bg-white p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[#8a918c]">VERSION 1</span><StateBadge state={original.state} /></div><p className="mt-3 text-sm font-semibold">Initial researched thesis</p><p className="mt-1 text-[11px] text-[#8a918c]">As of Feb 27, 2025</p></div>
            <ArrowRight className="mx-auto rotate-90 text-[#8b968e] sm:rotate-0" size={18} />
            <div className="flex-1 rounded-xl border border-[#d9caa9] bg-[#f8eedc] p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[#8a7b66]">VERSION 2</span><StateBadge state={current.state} /></div><p className="mt-3 text-sm font-semibold">Market-access risk realized</p><p className="mt-1 text-[11px] text-[#8a8176]">As of Apr 16, 2025</p></div>
          </div>
        </div>
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#f8f8f4] p-5"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]"><History size={14} /> Journal integrity</div><ul className="mt-4 space-y-3 text-xs leading-5 text-[#6f7972]"><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />Original evidence snapshot retained</li><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />Research cutoffs recorded</li><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />State change linked to evidence</li></ul></div>
      </section>

      <section className="relative mt-8 pl-8 before:absolute before:bottom-5 before:left-[11px] before:top-5 before:w-px before:bg-[#cdd5cd] sm:pl-12 sm:before:left-[15px]">
        {[current, original].map((version, index) => (
          <article key={version.id} className={`relative mb-6 rounded-[22px] border p-5 sm:p-6 ${index === 0 ? 'border-[#d8c9a9] bg-[#faf5eb]' : 'border-[#d9ddd5] bg-[#fafaf7]'}`}>
            <span className={`absolute -left-[30px] top-6 grid h-6 w-6 place-items-center rounded-full border-4 border-[#f3f3ee] sm:-left-[42px] sm:h-8 sm:w-8 ${index === 0 ? 'bg-[#c68a46] text-white' : 'bg-[#77907e] text-white'}`}><span className="text-[9px] font-bold">V{version.version}</span></span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]">Version {version.version} · {new Date(version.asOf).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</p><h2 className="mt-2 text-lg font-semibold">{version.version === 2 ? 'Thesis moved to closer observation' : 'Initial thesis established'}</h2></div><StateBadge state={version.state} large /></div>
            <p className="mt-5 rounded-xl border border-[#e0e2dc] bg-white/70 p-4 font-serif text-lg leading-7 text-[#3a463f]">{version.coreThesis}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]">Why this version exists</p><p className="mt-2 text-xs leading-5 text-[#6f7972]">{version.changedBecause}</p></div><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d857f]">Evidence snapshot</p><p className="mt-2 text-xs leading-5 text-[#6f7972]">{version.supportingEvidenceIds.length} supporting · {version.challengingEvidenceIds.length} challenging · cutoff preserved at {new Date(version.asOf).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p></div></div>

            {version.version === 2 && addedEvidenceIds.map((evidenceId) => {
              const evidence = nvdaEvidenceById[evidenceId];
              const source = nvdaSourcesById[evidence.sourceId];
              return <div key={evidenceId} className="mt-5 rounded-xl border border-[#e1cfc3] bg-[#f5e9e1] p-4"><div className="flex flex-wrap items-center gap-2"><FilePlus2 size={13} className="text-[#925b3e]" /><span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8e5a43]">New evidence added</span><RelationBadge relation={evidence.relation} /></div><p className="mt-3 text-sm font-semibold text-[#4e4038]">{evidence.title}</p><p className="mt-2 text-xs leading-5 text-[#76665e]">{evidence.interpretation}</p><a href={source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-[11px] font-semibold text-[#8e5a43] hover:underline">Open SEC filing ↗</a></div>;
            })}
          </article>
        ))}
      </section>

      <section className="mt-2 flex flex-col gap-4 rounded-[20px] border border-[#d9ddd5] bg-[#eef1ec] p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5d7463]"><ShieldAlert size={13} /> Current interpretation</div><p className="mt-2 text-sm font-semibold text-[#3b4840]">WATCH means re-examine the affected assumptions—not automatically abandon the thesis.</p></div><Link href="/monitor/nvda" className="inline-flex min-w-max items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]">Return to monitor <ArrowRight size={15} /></Link></section>
    </div>
  );
}
