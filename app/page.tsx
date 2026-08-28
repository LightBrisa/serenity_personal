import Link from 'next/link';
import { ArrowRight, CircleHelp, Clock3, FileText, Lightbulb, ShieldAlert } from 'lucide-react';
import { HomeDecisionTask } from '@/src/components/decision-experience';
import { IdeaCapture } from '@/src/components/idea-capture';
import { FixtureNotice } from '@/src/components/ui';
import {
  currentNvdaThesisVersion,
  nvdaEvidenceById,
  nvdaMonitorEvents,
  nvdaThesis,
} from '@/src/data/nvda-fixtures';

export default function Home() {
  const latestEvent = nvdaMonitorEvents[0];
  const strongestSupport = nvdaEvidenceById['ev-fy25-growth'];
  const strongestChallenge = nvdaEvidenceById['ev-margin-pressure'];

  return (
    <div className="mx-auto max-w-[1160px] px-5 pb-16 pt-9 sm:px-8 lg:px-10 lg:pt-12">
      <FixtureNotice compact />

      <HomeDecisionTask eventSummary={latestEvent.summary} />

      <section className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-[#7d857f]">我的 NVDA 判断</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">上次我是这样想的</h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#8a918c]"><Clock3 size={12} />依据截至 2025 年 2 月 27 日</div>
        </div>

        <div className="mt-5 rounded-[22px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e0e8de] text-sm font-bold text-[#28533f]">NV</span><div><p className="font-semibold">{nvdaThesis.company}</p><p className="text-xs text-[#7c857f]">纳斯达克 · {nvdaThesis.ticker}</p></div></div>
              <p className="mt-5 font-serif text-xl leading-8 text-[#344039]">{currentNvdaThesisVersion.coreThesis}</p>
            </div>
            <Link href="/thesis/nvda" className="inline-flex min-w-max items-center gap-2 text-xs font-semibold text-[#315d47] hover:underline">看完整判断 <ArrowRight size={13} /></Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-[#d8e1d6] bg-[#edf3eb] p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#58705f]"><Lightbulb size={13} />最有力的依据</div>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#3b4941]">{strongestSupport.title}</p>
            </div>
            <div className="rounded-2xl border border-[#e2d0c6] bg-[#f7eee8] p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8e5e48]"><ShieldAlert size={13} />最值得担心</div>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#51433d]">{strongestChallenge.title}</p>
            </div>
            <div className="rounded-2xl border border-[#d9ddd5] bg-[#f1f2ee] p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><CircleHelp size={13} />仍然不知道</div>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#49534d]">当前估值是否已把持续高增长算得太满。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 border-t border-[#d9ddd5] pt-9">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#7d857f]"><FileText size={14} />记下一个新想法</div>
        <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.9rem,3.5vw,3rem)] leading-[1.08] tracking-[-0.035em] text-[#17251f]">看到一个说法，先别急着相信。</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f7872]">当前只用 NVDA 做完整示例。你可以改写下面这句话，体验如何把它变成自己的判断。</p>
        <div className="max-w-4xl"><IdeaCapture /></div>
      </section>
    </div>
  );
}
