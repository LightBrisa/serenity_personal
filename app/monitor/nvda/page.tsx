import Link from 'next/link';
import { ArrowRight, CalendarClock, CircleHelp, ExternalLink, Eye, FilterX, ShieldAlert } from 'lucide-react';
import { CurrentDecisionIndicator, DecisionReview } from '@/src/components/decision-experience';
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
    <div className="mx-auto max-w-[1160px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-[#7c857f]">NVDA · 待我确认</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4vw,3.45rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">有一件新变化，需要你决定怎么处理。</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">这里不会自动替你改判断。先看发生了什么、影响哪条前提、还缺什么，再由你选择。</p>
        </div>
        <FixtureNotice compact />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="rounded-[22px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">变化发生前，我的判断</p><StateBadge state={currentNvdaThesisVersion.state} /></div>
          <p className="mt-4 font-serif text-xl leading-8 text-[#344039]">{currentNvdaThesisVersion.coreThesis}</p>
          <Link href="/thesis/nvda" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#315d47] hover:underline">回看完整判断 <ArrowRight size={13} /></Link>
        </div>
        <div className="rounded-[22px] border border-[#d8c9a9] bg-[#f5ead5] p-5">
          <p className="text-[10px] font-bold tracking-[0.08em] text-[#8a642f]">这件事现在的处理状态</p>
          <div className="mt-4"><CurrentDecisionIndicator /></div>
          <p className="mt-4 text-xs leading-5 text-[#74644f]">在你明确选择前，原判断不会被覆盖，也不会生成新版本。</p>
        </div>
      </section>

      <article className="mt-7 overflow-hidden rounded-[24px] border border-[#e0c8b9] bg-[#faf7f3]">
        <header className="border-b border-[#e7d8ce] bg-[#f3e7df] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><RelationBadge relation={primaryEvent.impact.relation} /><span className="rounded-full bg-[#ead6ca] px-2.5 py-1 text-[10px] font-bold tracking-[0.07em] text-[#8e5a43]">影响较大</span></div><span className="text-[11px] text-[#8a817b]">2025 年 4 月 15 日 · 21:22 UTC</span></div>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-8 tracking-[-0.025em] text-[#3c302a]">{primaryEvent.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#71635c]">{primaryEvent.summary}</p>
        </header>

        <div className="p-5 sm:p-7">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#dfe2dc] bg-white p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><Eye size={13} />为什么会影响我</div>
              <p className="mt-3 text-sm leading-6 text-[#536058]">{primaryEvent.impact.explanation}</p>
            </div>
            <div className="rounded-2xl border border-[#e0d2c9] bg-[#f7eee8] p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8e5e48]"><ShieldAlert size={13} />它碰到了哪些前提</div>
              <div className="mt-4 space-y-3">
                {primaryEvent.impact.affectedAssumptionIds.map((id) => {
                  const assumption = nvdaAssumptionsById[id];
                  return <div key={id} className="rounded-xl bg-white/70 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><p className="max-w-[230px] text-xs font-semibold leading-5 text-[#51453f]">{assumption.statement}</p><AssumptionStatus status={assumption.status} /></div></div>;
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-[#d9ddd5] bg-[#f3f4f0] p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><CircleHelp size={13} />还缺什么才能下结论</div>
              <ul className="mt-4 space-y-3 text-xs leading-5 text-[#66716a]"><li>• H20 许可最终是否获得，以及可恢复多少收入。</li><li>• 55 亿美元预计费用与实际费用的差距。</li><li>• 中国以外客户的需求能否抵消这项影响。</li></ul>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#d9ddd5] bg-[#f5f6f2] p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">如果只按现有材料调整</p><div className="mt-3 flex items-center gap-3"><StateBadge state={primaryEvent.impact.stateBefore} /><ArrowRight size={15} className="text-[#8a918c]" /><StateBadge state={primaryEvent.impact.stateAfter} /></div></div>
              <p className="max-w-md text-xs leading-5 text-[#747d77]"><strong className="text-[#4d5951]">这只是建议，不是自动结论。</strong> 原因是市场准入和短期利润率已经受影响，但全球需求与 Blackwell 采用还没有被否定。</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-[#e1e4de] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2"><SourceTypeLabel type={primarySource.type} /><span className="text-[11px] font-semibold text-[#5f6962]">{primarySource.publisher}</span></div>
            <a href={primarySource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#315d47] hover:underline">查看 SEC 申报文件 <ExternalLink size={11} /></a>
          </div>
        </div>
      </article>

      <div className="mt-7"><DecisionReview /></div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#7d857f]"><CalendarClock size={13} />接下来要等什么</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {upcoming.map((event) => <div key={event.id} className="rounded-xl border border-[#e2e4df] bg-white p-4"><div className="flex items-center justify-between gap-2"><span className="rounded-full bg-[#e7ece5] px-2 py-1 text-[9px] font-bold text-[#52685a]">以后再看</span><span className="text-[10px] text-[#8d948f]">{new Date(event.occurredAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</span></div><p className="mt-3 text-sm font-semibold leading-5 text-[#3c4841]">{event.title.replace(/^(待跟踪：|即将公布：)/, '')}</p><p className="mt-2 text-xs leading-5 text-[#7a837d]">{event.impact.explanation}</p></div>)}
          </div>
        </div>
        <div className="rounded-[20px] border border-[#d7ddd6] bg-[#edf1eb] p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#58705f]"><FilterX size={13} />哪些消息不用管</div>
          <p className="mt-3 text-xs leading-5 text-[#66726a]">常规股价评论、未经核实的传言和重复报道不会进入待确认列表，除非它们直接影响已有前提。</p>
        </div>
      </section>
    </div>
  );
}
