import { ArrowRight, CalendarClock, FilterX } from 'lucide-react';
import type { ImpactAnalysisInput } from '@/src/ai/impact-analysis';
import { DecisionStatusPanel, MonitorDecisionIntro } from '@/src/components/decision-experience';
import { ModelImpactExperience } from '@/src/components/model-impact-experience';
import { SafeLink as Link } from '@/src/components/safe-link';
import { FixtureNotice, StateBadge } from '@/src/components/ui';
import {
  currentNvdaThesisVersion,
  nvdaAssumptions,
  nvdaMonitorEvents,
  nvdaSourcesById,
} from '@/src/data/nvda-fixtures';
import { nvdaH20OfflineAnalysis } from '@/src/data/nvda-model-fixtures';

export default function ThesisMonitorPage() {
  const primaryEvent = nvdaMonitorEvents[0];
  const primarySource = nvdaSourcesById[primaryEvent.sourceId];
  const upcoming = nvdaMonitorEvents.filter((event) => event.status === 'UPCOMING');
  const impactInput: ImpactAnalysisInput = {
    provenanceMode: 'RETROSPECTIVE_FIXTURE',
    analysisAsOf: primaryEvent.impact.assessedAt,
    thesis: {
      id: currentNvdaThesisVersion.id,
      ticker: 'NVDA',
      coreThesis: currentNvdaThesisVersion.coreThesis,
      horizon: currentNvdaThesisVersion.horizon,
    },
    source: {
      id: primarySource.id,
      title: primarySource.title,
      publisher: primarySource.publisher,
      publishedAt: primarySource.publishedAt,
      availableAt: primarySource.availableAt,
      retrievedAt: primarySource.retrievedAt,
      rawFact: primarySource.rawFact,
    },
    assumptions: nvdaAssumptions.map(({ id, statement }) => ({ id, statement })),
  };

  return (
    <div className="mx-auto max-w-[1160px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <MonitorDecisionIntro />
        <FixtureNotice compact />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="rounded-[22px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">变化发生前，我的判断</p><StateBadge state={currentNvdaThesisVersion.state} /></div>
          <p className="mt-4 font-serif text-xl leading-8 text-[#344039]">{currentNvdaThesisVersion.coreThesis}</p>
          <Link href="/thesis/nvda" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#315d47] hover:underline">回看完整判断 <ArrowRight size={13} /></Link>
        </div>
        <DecisionStatusPanel />
      </section>

      <ModelImpactExperience
        input={impactInput}
        offlineDraft={nvdaH20OfflineAnalysis}
        sourceType={primarySource.type}
        sourceUrl={primarySource.url}
      />

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
