import {
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  ExternalLink,
  Eye,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../app/globals.css';
import { CurrentDecisionIndicator, DecisionReview } from '@/src/components/decision-experience';
import { SourceTypeLabel, StateBadge } from '@/src/components/ui';
import {
  currentNvdaThesisVersion,
  fixtureMeta,
  nvdaAssumptionsById,
  nvdaMonitorEvents,
  nvdaSourcesById,
} from '@/src/data/nvda-fixtures';
import { nvdaH20OfflineAnalysis } from '@/src/data/nvda-model-fixtures';

const primaryEvent = nvdaMonitorEvents[0];
const primarySource = nvdaSourcesById[primaryEvent.sourceId];
const decisionStorageKey = 'serenity-personal:nvda:decision';
const decisionEventName = 'serenity-personal:decision-updated';

const effectCopy = {
  STRENGTHENS: { label: '可能得到支持', className: 'bg-[#e4eee3] text-[#3f6950]' },
  WEAKENS: { label: '可能被削弱', className: 'bg-[#f1dfd4] text-[#8e5a43]' },
  UNCLEAR: { label: '方向仍不明确', className: 'bg-[#e8ebe7] text-[#68736c]' },
} as const;

function DemoApp() {
  const resetDemo = () => {
    window.localStorage.removeItem(decisionStorageKey);
    window.dispatchEvent(new Event(decisionEventName));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#f3f3ee] text-[#18211d]">
      <div className="border-b border-[#d8ded6] bg-[#173e32] px-5 py-2 text-center text-[11px] font-semibold tracking-[0.04em] text-[#e4eee3]">
        离线演示模式 · 固定历史数据 · 不调用模型 · 不访问网络
      </div>

      <header className="sticky top-0 z-30 border-b border-[#dcded6] bg-[#f8f8f4]/95 px-5 backdrop-blur sm:px-8">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#173e32] text-sm font-semibold text-white">S</span>
            <div><p className="text-sm font-semibold">Serenity Personal</p><p className="text-[10px] tracking-[0.1em] text-[#78817b]">帮我想清楚</p></div>
          </div>
          <div className="flex items-center gap-3">
            <CurrentDecisionIndicator compact />
            <button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#cfd5ce] bg-white px-3 py-2 text-xs font-semibold text-[#536158] hover:border-[#9eab9f]"><RotateCcw size={13} />重置演示</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-9 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] text-[#7c857f]">NVDA · 处理变化</p>
            <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.03] tracking-[-0.04em] text-[#17251f]">新材料来了，先看它碰到了什么。</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">系统把来源事实、影响推断和未知项分开准备；最后是否修改判断、为什么，仍由你决定。</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dfcfb4] bg-[#f8f1e5] px-3 py-2 text-[10px] font-bold text-[#806b4e]"><AlertCircle size={13} />历史快照截至 2025-04-16</span>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="rounded-[22px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">变化发生前，我的判断</p><StateBadge state={currentNvdaThesisVersion.state} /></div>
            <p className="mt-4 font-serif text-xl leading-8 text-[#344039]">{currentNvdaThesisVersion.coreThesis}</p>
          </div>
          <aside className="rounded-[20px] border border-[#dfcfb4] bg-[#f8f1e5] p-5">
            <p className="text-[10px] font-bold tracking-[0.08em] text-[#806b4e]">演示任务</p>
            <ol className="mt-4 space-y-3 text-xs leading-5 text-[#75664f]"><li>1. 核对来源事实</li><li>2. 看系统整理的冲突与未知</li><li>3. 选择处理方式并写理由</li></ol>
          </aside>
        </section>

        <article className="mt-7 overflow-hidden rounded-[24px] border border-[#d9ddd5] bg-[#fafaf7]">
          <header className="border-b border-[#dedfd9] bg-[#eceee9] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2"><SourceTypeLabel type={primarySource.type} /><span className="rounded-full bg-[#dde2dc] px-2.5 py-1 text-[10px] font-bold text-[#657169]">固定历史材料</span></div>
              <span className="text-[11px] text-[#8a918c]">2025-04-15 · 21:22 UTC</span>
            </div>
            <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-8 tracking-[-0.025em] text-[#344039]">{primarySource.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#66716a]">{primarySource.rawFact}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-[#78817b]"><span>{primarySource.publisher}</span><span>·</span><span>原始事实，不含模型结论</span><span>·</span><span>回溯重建，不声称 2025 年已完成本地抓取</span><a href={primarySource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#315d47]">主动查看原始来源 <ExternalLink size={11} /></a></div>
          </header>

          <div id="analysis" className="p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e0c8b9] bg-[#f1dfd4] px-2.5 py-1 text-[10px] font-bold text-[#8e5a43]"><Sparkles size={11} />离线预置分析 · 回归样例</span>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em]">系统整理了什么，仍需我核对</h2>
              </div>
              <span className="rounded-full border border-[#d7dad5] bg-[#f1f2ee] px-2.5 py-1 text-[10px] font-bold text-[#68736c]">可能影响较大</span>
            </div>
            <p className="mt-4 rounded-xl border border-[#dfcfb4] bg-[#f8f1e5] px-4 py-3 text-[11px] leading-5 text-[#806b4e]">本页为了无网络、可重复演示而预置这份结构化分析。本次没有调用模型，不代表实时研究。</p>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <section className="rounded-2xl border border-[#dfe2dc] bg-white p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><Eye size={13} />这项变化可能意味着什么</div>
                <p className="mt-3 text-sm leading-6 text-[#536058]">{nvdaH20OfflineAnalysis.explanation}</p>
              </section>
              <section className="rounded-2xl border border-[#e0d2c9] bg-[#f7eee8] p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8e5e48]"><ShieldAlert size={13} />可能碰到的前提</div>
                <div className="mt-4 space-y-3">
                  {nvdaH20OfflineAnalysis.affectedAssumptions.map((affected) => {
                    const effect = effectCopy[affected.effect];
                    return <div key={affected.id} className="rounded-xl bg-white/75 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><p className="max-w-[230px] text-xs font-semibold leading-5 text-[#51453f]">{nvdaAssumptionsById[affected.id].statement}</p><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${effect.className}`}>{effect.label}</span></div><p className="mt-2 text-[11px] leading-5 text-[#7b6b63]">{affected.rationale}</p></div>;
                  })}
                </div>
              </section>
              <section className="rounded-2xl border border-[#d9ddd5] bg-[#f3f4f0] p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><CircleHelp size={13} />还缺什么才能判断</div>
                <ul className="mt-4 space-y-3 text-xs leading-5 text-[#66716a]">{nvdaH20OfflineAnalysis.evidenceGaps.map((item) => <li key={item}>• {item}</li>)}</ul>
              </section>
            </div>

            <section className="mt-5 rounded-2xl border border-[#d9ddd5] bg-[#f5f6f2] p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#7d857f]"><CheckCircle2 size={13} />分析边界</div>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-[#747d77]">{nvdaH20OfflineAnalysis.limitations.map((item) => <li key={item}>• {item}</li>)}</ul>
              <p className="mt-3 border-t border-[#e1e4de] pt-3 text-[11px] leading-5 text-[#7d857f]">系统没有更改原判断或前提状态。下面的处理方式和理由由你填写。</p>
            </section>
          </div>
        </article>

        <section className="mt-7">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#58705f]"><Sparkles size={13} />03 · 轮到我做决定</div>
          <div className="[&_a]:hidden">
            <DecisionReview
              evidenceGaps={nvdaH20OfflineAnalysis.evidenceGaps}
              analysisRunId="offline-fixture-h20-v1"
              analysisSource="OFFLINE_FIXTURE"
              analysisReady
            />
          </div>
        </section>

        <footer className="mt-9 rounded-[20px] border border-[#d7ddd6] bg-[#edf1eb] p-5 text-xs leading-6 text-[#66726a] sm:p-6">
          <p className="font-semibold text-[#3f5547]">这个 ZIP 证明什么</p>
          <p className="mt-2">它证明真实 Serenity 产品中的来源分层、结构化影响合同、人类判断状态机和本地处理记录可以离线重复演示。在线仓库另有 server-only OpenAI Responses API 实现；是否完成真实模型 smoke 以同包验证报告为准，本 HTML 不作替代证明。</p>
          <p className="mt-2 text-[11px] text-[#7d857f]">数据边界：{fixtureMeta.disclaimer}</p>
        </footer>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><DemoApp /></StrictMode>);
