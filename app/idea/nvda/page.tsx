import { AlertCircle, CircleHelp, FileText, ShieldAlert } from 'lucide-react';
import { BreakdownEditor } from '@/src/components/breakdown-editor';
import { CausalChain } from '@/src/components/causal-chain';
import { ideaStorageKey, SavedDraftText } from '@/src/components/saved-draft';
import { FixtureNotice, Unknown, layerLabels } from '@/src/components/ui';
import {
  nvdaAssumptions,
  nvdaIdea,
  nvdaIdeaBreakdown,
  nvdaResearchQuestions,
} from '@/src/data/nvda-fixtures';

export default function IdeaBreakdownPage() {
  const priorityAssumptions = nvdaAssumptions.filter((item) => item.importance !== 'MEDIUM').slice(0, 4);
  const priorityQuestions = nvdaResearchQuestions.slice(0, 3);

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-7 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-[#7c857f]">NVDA · 先说清楚</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4vw,3.35rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">先确认：你真正想弄清什么？</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">下面用一套固定示例，把这段话展开成需要成立的前提。你可以修改核心判断，再决定先查什么。</p>
        </div>
        <FixtureNotice compact />
      </div>

      <section className="mt-8 rounded-[18px] border border-[#dedfd9] bg-[#eceee9] p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#7d857f]"><FileText size={13} /> 原始想法</div>
        <blockquote className="mt-3 border-l-2 border-[#9caf9f] pl-4 font-serif text-lg leading-7 text-[#39453e]">“<SavedDraftText storageKey={ideaStorageKey} fallback={nvdaIdea.rawText} />”</blockquote>
        <p className="mt-3 text-[11px] text-[#8a918c]">来源：{nvdaIdea.sourceLabel} · 当前阶段尚未核验其中的事实主张。</p>
      </section>

      <div className="mt-6"><BreakdownEditor defaultThesis={nvdaIdeaBreakdown.coreThesis} defaultHorizon={nvdaIdeaBreakdown.horizon} /></div>

      <section className="mt-6 rounded-[20px] border border-[#d9ddd5] bg-[#f8f8f4] p-5 sm:p-6">
        <p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">先检查逻辑</p>
        <h2 className="mt-2 text-lg font-semibold">这句话要成立，得满足什么</h2>
        <p className="mt-2 text-xs leading-5 text-[#7a837d]">中间任何一环站不住，最后的判断都需要重看。</p>
        <div className="mt-5"><CausalChain steps={nvdaIdeaBreakdown.causalChain} /></div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">先看最重要的</p><h2 className="mt-2 text-lg font-semibold">它成立，需要哪些前提</h2></div>
            <span className="rounded-full bg-[#e5ebe3] px-2.5 py-1 text-[10px] font-bold text-[#4b6856]">优先核对 4 项</span>
          </div>
          <div className="mt-5 divide-y divide-[#e2e4de]">
            {priorityAssumptions.map((assumption, index) => (
              <div key={assumption.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#d4d9d2] bg-white text-[10px] font-bold text-[#65736a]">{index + 1}</span>
                <div><p className="text-sm font-semibold leading-5 text-[#344039]">{assumption.statement}</p><p className="mt-1.5 text-xs leading-5 text-[#7c857f]">{assumption.rationale}</p></div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[20px] border border-[#dfd7cb] bg-[#f8f2e9] p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8a6844]"><AlertCircle size={13} /> 现在还不知道什么</div>
            <ul className="mt-4 space-y-3">
              {nvdaIdeaBreakdown.uncertainties.map((item, index) => <li key={item} className="flex gap-2.5 text-xs leading-5 text-[#716960]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b58455]" />{item}{index === 2 && <span className="ml-1"><Unknown /></span>}</li>)}
            </ul>
          </section>
          <section className="rounded-[20px] border border-[#e1d4cd] bg-[#f6ece6] p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8e5e48]"><ShieldAlert size={13} /> 哪几件事最可能推翻它</div>
            <ul className="mt-4 space-y-3">{nvdaIdeaBreakdown.risks.map((item) => <li key={item} className="flex gap-2.5 text-xs leading-5 text-[#71645e]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b2765c]" />{item}</li>)}</ul>
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">先别什么都查</p><h2 className="mt-2 text-lg font-semibold">接下来先查这三件事</h2></div><p className="text-[11px] text-[#8a918c]">既找让人更有信心的，也找会让人更谨慎的</p></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {priorityQuestions.map((question) => <div key={question.id} className="flex gap-3 rounded-xl border border-[#e0e3dd] bg-white p-4"><CircleHelp size={15} className="mt-0.5 shrink-0 text-[#71867a]" /><div><p className="text-sm font-semibold leading-5 text-[#3c4841]">{question.question}</p><p className="mt-1 text-[10px] font-bold tracking-[0.06em] text-[#919892]">{layerLabels[question.layer]}</p></div></div>)}
        </div>
      </section>
    </div>
  );
}
