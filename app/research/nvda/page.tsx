import Link from 'next/link';
import { ArrowRight, CircleHelp, Clock3, Lightbulb, ShieldAlert, TriangleAlert } from 'lucide-react';
import { EvidenceLedger } from '@/src/components/evidence-ledger';
import { SavedDraftText, thesisStorageKey } from '@/src/components/saved-draft';
import { FixtureNotice, Unknown, layerLabels } from '@/src/components/ui';
import {
  fixtureMeta,
  nvdaEvidence,
  nvdaIdeaBreakdown,
  nvdaResearchQuestions,
  nvdaResearchRun,
  nvdaSources,
} from '@/src/data/nvda-fixtures';

const questionStatusLabels = {
  ANSWERED: '已有答案',
  PARTIAL: '还不完整',
  OPEN: '还不知道',
} as const;

export default function ResearchWorkspacePage() {
  const researchEvidence = nvdaEvidence.filter((item) => nvdaResearchRun.evidenceIds.includes(item.id));
  const strongestSupport = researchEvidence.find((item) => item.id === 'ev-fy25-growth')!;
  const strongestChallenge = researchEvidence.find((item) => item.id === 'ev-margin-pressure')!;
  const openQuestions = nvdaResearchQuestions.filter((question) => question.status !== 'ANSWERED');

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#7c857f]"><span>NVDA · 待核对</span><span className="text-[#b3b7b3]">/</span><span>依据截至 2025 年 2 月 27 日</span></div>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4vw,3.45rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">这条判断，现在站得住吗？</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">先看结论和最大分歧。想核对细节时，再展开下面的原始依据。</p>
        </div>
        <FixtureNotice compact />
      </div>

      <section className="mt-8 rounded-[24px] border border-[#cfd8cf] bg-[#edf2eb] p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <p className="text-[10px] font-bold tracking-[0.08em] text-[#5d7665]">我在验证这句话</p>
            <p className="mt-3 max-w-3xl font-serif text-xl leading-8 text-[#304039]"><SavedDraftText storageKey={thesisStorageKey} fallback={nvdaIdeaBreakdown.coreThesis} /></p>
            <Link href="/idea/nvda" className="mt-4 inline-flex text-xs font-semibold text-[#315d47] hover:underline">这不是我的意思，回去修改</Link>
          </div>
          <div className="rounded-2xl border border-[#d9caa9] bg-[#f7edd9] p-5">
            <p className="text-[10px] font-bold tracking-[0.08em] text-[#8a642f]">目前怎么看</p>
            <p className="mt-3 text-base font-semibold leading-7 text-[#4b3d2b]">需求和产品放量有实际数据支撑，但利润率、竞争和市场准入都要求保留意见。</p>
            <p className="mt-3 text-xs leading-5 text-[#77684f]">所以现在可以继续研究，还不能把它当成确定结论。</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[20px] border border-[#d8e1d6] bg-[#f1f5ef] p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#58705f]"><Lightbulb size={14} />最有力的依据</div>
          <h2 className="mt-3 text-base font-semibold leading-6 text-[#344039]">{strongestSupport.title}</h2>
          <p className="mt-2 text-xs leading-5 text-[#68746c]">{strongestSupport.interpretation}</p>
        </div>
        <div className="rounded-[20px] border border-[#e2d0c6] bg-[#f8efea] p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8e5e48]"><ShieldAlert size={14} />最值得担心的反证</div>
          <h2 className="mt-3 text-base font-semibold leading-6 text-[#4b3e38]">{strongestChallenge.title}</h2>
          <p className="mt-2 text-xs leading-5 text-[#756760]">{strongestChallenge.interpretation}</p>
        </div>
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#f5f5f1] p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><CircleHelp size={14} />仍然不知道</div>
          <h2 className="mt-3 text-base font-semibold leading-6 text-[#3f4943]">现在的价格，是否已经把好消息算得太满？</h2>
          <p className="mt-2 text-xs leading-5 text-[#747d77]">没有接入可信的实时价格与估值数据，所以这一部分保持 <Unknown />。</p>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-[22px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">最大分歧</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">需求很强，不等于每一块增长都能变成同样好的利润。</h2>
          <p className="mt-3 text-sm leading-6 text-[#68716b]">云厂商投入、数据中心收入和 Blackwell 放量相互印证；但新品切换压低毛利率，客户也在发展自研芯片。真正要判断的不是“AI 热不热”，而是 NVIDIA 能否持续把需求转成高质量利润。</p>
        </div>
        <div className="rounded-[22px] border border-[#dfd7cb] bg-[#f8f2e9] p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8a6844]"><TriangleAlert size={13} />还有哪些问题没答清</div>
          <div className="mt-4 space-y-4">
            {openQuestions.slice(0, 3).map((question) => (
              <div key={question.id} className="border-b border-[#e5dcd0] pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold leading-5 text-[#4c443b]">{question.question}</p><span className="min-w-max rounded-full bg-white/65 px-2 py-1 text-[8px] font-bold text-[#8a6844]">{questionStatusLabels[question.status]}</span></div>
                <p className="mt-1.5 text-[9px] font-bold tracking-[0.06em] text-[#9a8d7c]">{layerLabels[question.layer]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <details className="group mt-8 rounded-[22px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
        <summary className="cursor-pointer list-none marker:hidden">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">需要时再核对</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">查看全部原始依据</h2><p className="mt-2 text-xs leading-5 text-[#747d77]">每条都把来源原文和它对判断的意义分开。</p></div>
            <span className="text-xs font-semibold text-[#315d47] group-open:hidden">展开</span>
            <span className="hidden text-xs font-semibold text-[#315d47] group-open:inline">收起</span>
          </div>
        </summary>
        <div className="mt-6"><EvidenceLedger evidence={researchEvidence} sources={nvdaSources} /></div>
      </details>

      <section className="mt-7 flex flex-col gap-4 rounded-[20px] border border-[#cbd6cc] bg-[#eaf0e8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-sm font-semibold text-[#314138]">材料已经够你形成一版暂时判断。</p><p className="mt-1 flex items-center gap-2 text-xs leading-5 text-[#6c786f]"><Clock3 size={13} />研究截止：{new Date(fixtureMeta.researchAsOf).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p></div>
        <Link href="/thesis/nvda" className="inline-flex min-w-max items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgb(23_62_50/18%)] transition hover:bg-[#214c3e]">看我现在怎么判断 <ArrowRight size={15} /></Link>
      </section>
    </div>
  );
}
