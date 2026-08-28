import Link from 'next/link';
import { ArrowRight, CircleHelp, Clock3, FileText, Lightbulb, ShieldAlert } from 'lucide-react';
import { CurrentDecisionIndicator } from '@/src/components/decision-experience';
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

      <section className="mt-8 overflow-hidden rounded-[26px] border border-[#d8c9a9] bg-[#f5ead5] shadow-[0_22px_60px_rgb(80_66_43/8%)]">
        <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#d9ae72] px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-[#5f4525]">今天有 1 件事值得你看</span>
              <CurrentDecisionIndicator compact />
            </div>
            <h1 className="mt-5 max-w-3xl font-serif text-[clamp(2.2rem,4.7vw,4.2rem)] leading-[1.02] tracking-[-0.04em] text-[#2f281f]">一条新限制，可能会改变你对 NVDA 的判断。</h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6f604b]">{latestEvent.summary}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/monitor/nvda" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3f3325] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#554633]">先看它影响了什么 <ArrowRight size={15} /></Link>
              <Link href="/thesis/nvda" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cdbb9d] bg-white/55 px-5 py-3 text-sm font-semibold text-[#6e5636] transition hover:bg-white/80">回看我原来的判断</Link>
            </div>
          </div>
          <aside className="rounded-[20px] border border-[#dfcfb4] bg-white/48 p-5">
            <p className="text-[10px] font-bold tracking-[0.09em] text-[#8a7354]">为什么和我有关</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#4a3d2e]">它直接影响“海外市场仍能顺利转化为收入”这项前提。</p>
            <div className="mt-5 border-t border-[#dfd0b8] pt-4">
              <p className="text-[10px] font-bold tracking-[0.08em] text-[#8a7354]">还不能直接得出什么</p>
              <p className="mt-2 text-xs leading-5 text-[#74644f]">单凭这件事，还不能说明全球 AI 需求或 Blackwell 的采用已经逆转。</p>
            </div>
          </aside>
        </div>
      </section>

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
