import { ArrowLeft, ArrowRight, Check, History, ShieldAlert } from 'lucide-react';
import { LocalDecisionHistory } from '@/src/components/decision-experience';
import { SafeLink as Link } from '@/src/components/safe-link';
import { FixtureNotice, StateBadge } from '@/src/components/ui';
import { nvdaThesisVersions } from '@/src/data/nvda-fixtures';

export default function ThesisHistoryPage() {
  const original = nvdaThesisVersions[0];

  return (
    <div className="mx-auto max-w-[1040px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/thesis/nvda" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315d47] hover:underline"><ArrowLeft size={13} />返回我的判断</Link>
          <p className="mt-5 text-xs font-semibold tracking-[0.08em] text-[#7c857f]">NVDA · 处理记录</p>
          <h1 className="mt-3 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">我什么时候处理过判断，为什么。</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">新材料不会覆盖旧想法。改变结论会留下修改记录；先补证据只记为处理中。</p>
        </div>
        <FixtureNotice compact />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <p className="mb-3 text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">最近一次处理</p>
          <LocalDecisionHistory />
        </div>
        <aside className="rounded-[20px] border border-[#d9ddd5] bg-[#f8f8f4] p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#7d857f]"><History size={14} />这里怎么记</div>
          <ul className="mt-4 space-y-3 text-xs leading-5 text-[#6f7972]"><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />先保留当时看到的材料</li><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />再记录你的选择和理由</li><li className="flex gap-2"><Check size={13} className="mt-0.5 text-[#4f765d]" />旧判断永远可以回看</li></ul>
        </aside>
      </section>

      <section className="relative mt-8 pl-8 before:absolute before:bottom-5 before:left-[11px] before:top-5 before:w-px before:bg-[#cdd5cd] sm:pl-12 sm:before:left-[15px]">
        <article className="relative rounded-[22px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <span className="absolute -left-[30px] top-6 grid h-6 w-6 place-items-center rounded-full border-4 border-[#f3f3ee] bg-[#77907e] text-white sm:-left-[42px] sm:h-8 sm:w-8"><span className="text-[9px] font-bold">起</span></span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">2025 年 2 月 27 日 · 第一次把判断写下来</p><h2 className="mt-2 text-lg font-semibold">先保留这条判断，继续看需求和盈利能力</h2></div>
            <StateBadge state={original.state} large />
          </div>
          <p className="mt-5 rounded-xl border border-[#e0e2dc] bg-white/70 p-4 font-serif text-lg leading-7 text-[#3a463f]">{original.coreThesis}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">我为什么先这样判断</p><p className="mt-2 text-xs leading-5 text-[#6f7972]">{original.changedBecause}</p></div>
            <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">当时有哪些材料</p><p className="mt-2 text-xs leading-5 text-[#6f7972]">{original.supportingEvidenceIds.length} 条让我更有信心 · {original.challengingEvidenceIds.length} 条让我更谨慎 · 研究截止日为 2025 年 2 月 27 日</p></div>
          </div>
        </article>
      </section>

      <section className="mt-8 flex flex-col gap-4 rounded-[20px] border border-[#d9ddd5] bg-[#eef1ec] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#5d7463]"><ShieldAlert size={13} />这次变化的材料仍然保留</div><p className="mt-2 text-sm font-semibold text-[#3b4840]">可以随时回看 H20 限制为什么会影响原判断，也可以重新选择。</p></div>
        <Link href="/monitor/nvda" className="inline-flex min-w-max items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]">回看这次变化 <ArrowRight size={15} /></Link>
      </section>
    </div>
  );
}
