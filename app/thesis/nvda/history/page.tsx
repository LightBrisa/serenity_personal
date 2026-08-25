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
        <div><Link href="/thesis/nvda" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315d47] hover:underline"><ArrowLeft size={13} /> 返回论点卡</Link><p className="mt-5 text-xs font-semibold tracking-[0.08em] text-[#7c857f]">NVDA · 决策日志</p><h1 className="mt-3 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">论点改了什么，为什么改。</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">每个版本都保留当时的判断、证据和研究截止时间。</p></div>
        <FixtureNotice compact />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#7d857f]"><GitCompareArrows size={14} /> 版本对比</div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-xl border border-[#dce1da] bg-white p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[#8a918c]">版本 1</span><StateBadge state={original.state} /></div><p className="mt-3 text-sm font-semibold">首版研究论点</p><p className="mt-1 text-[11px] text-[#8a918c]">截至 2025 年 2 月 27 日</p></div>
            <ArrowRight className="mx-auto rotate-90 text-[#8b968e] sm:rotate-0" size={18} />
            <div className="flex-1 rounded-xl border border-[#d9caa9] bg-[#f8eedc] p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[#8a7b66]">版本 2</span><StateBadge state={current.state} /></div><p className="mt-3 text-sm font-semibold">市场准入风险已落地</p><p className="mt-1 text-[11px] text-[#8a8176]">截至 2025 年 4 月 16 日</p></div>
          </div>
        </div>
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#f8f8f4] p-5"><div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#7d857f]"><History size={14} /> 记录原则</div><ul className="mt-4 space-y-3 text-xs leading-5 text-[#6f7972]"><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />保留原始证据快照</li><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />记录研究截止时间</li><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />状态变化关联具体证据</li></ul></div>
      </section>

      <section className="relative mt-8 pl-8 before:absolute before:bottom-5 before:left-[11px] before:top-5 before:w-px before:bg-[#cdd5cd] sm:pl-12 sm:before:left-[15px]">
        {[current, original].map((version, index) => (
          <article key={version.id} className={`relative mb-6 rounded-[22px] border p-5 sm:p-6 ${index === 0 ? 'border-[#d8c9a9] bg-[#faf5eb]' : 'border-[#d9ddd5] bg-[#fafaf7]'}`}>
            <span className={`absolute -left-[30px] top-6 grid h-6 w-6 place-items-center rounded-full border-4 border-[#f3f3ee] sm:-left-[42px] sm:h-8 sm:w-8 ${index === 0 ? 'bg-[#c68a46] text-white' : 'bg-[#77907e] text-white'}`}><span className="text-[9px] font-bold">V{version.version}</span></span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">版本 {version.version} · {new Date(version.asOf).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p><h2 className="mt-2 text-lg font-semibold">{version.version === 2 ? '论点状态转为“需观察”' : '首版论点建立'}</h2></div><StateBadge state={version.state} large /></div>
            <p className="mt-5 rounded-xl border border-[#e0e2dc] bg-white/70 p-4 font-serif text-lg leading-7 text-[#3a463f]">{version.coreThesis}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">为什么建立这个版本</p><p className="mt-2 text-xs leading-5 text-[#6f7972]">{version.changedBecause}</p></div><div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">证据快照</p><p className="mt-2 text-xs leading-5 text-[#6f7972]">{version.supportingEvidenceIds.length} 条支持 · {version.challengingEvidenceIds.length} 条削弱 · 研究截止时间保留为 {new Date(version.asOf).toLocaleDateString('zh-CN', { timeZone: 'UTC' })}</p></div></div>

            {version.version === 2 && addedEvidenceIds.map((evidenceId) => {
              const evidence = nvdaEvidenceById[evidenceId];
              const source = nvdaSourcesById[evidence.sourceId];
              return <div key={evidenceId} className="mt-5 rounded-xl border border-[#e1cfc3] bg-[#f5e9e1] p-4"><div className="flex flex-wrap items-center gap-2"><FilePlus2 size={13} className="text-[#925b3e]" /><span className="text-[10px] font-bold tracking-[0.06em] text-[#8e5a43]">新增证据</span><RelationBadge relation={evidence.relation} /></div><p className="mt-3 text-sm font-semibold text-[#4e4038]">{evidence.title}</p><p className="mt-2 text-xs leading-5 text-[#76665e]">{evidence.interpretation}</p><a href={source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-[11px] font-semibold text-[#8e5a43] hover:underline">查看 SEC 申报文件 ↗</a></div>;
            })}
          </article>
        ))}
      </section>

      <section className="mt-2 flex flex-col gap-4 rounded-[20px] border border-[#d9ddd5] bg-[#eef1ec] p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#5d7463]"><ShieldAlert size={13} /> 当前判断</div><p className="mt-2 text-sm font-semibold text-[#3b4840]">“需观察”表示要重新检验受影响的假设，并不等于直接放弃论点。</p></div><Link href="/monitor/nvda" className="inline-flex min-w-max items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]">返回跟踪页 <ArrowRight size={15} /></Link></section>
    </div>
  );
}
