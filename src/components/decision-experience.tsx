'use client';

import { ArrowRight, Check, CircleHelp, Clock3, RotateCcw } from 'lucide-react';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { getDecisionOutcome, type DecisionChoice } from '@/src/domain/decision';
import type { ThesisState } from '@/src/domain/types';
import { SavedDraftText, thesisStorageKey } from './saved-draft';
import { SafeLink as Link } from './safe-link';
import { StateBadge } from './ui';

const decisionStorageKey = 'serenity-personal:nvda:decision';
const decisionEventName = 'serenity-personal:decision-updated';

interface LocalDecision {
  choice: DecisionChoice;
  label: string;
  reason: string;
  stateAfter: 'STABLE' | 'WATCH' | 'INVALIDATED' | null;
  decidedAt: string;
  evidenceGaps: string[];
  analysisRunId: string | null;
  analysisSource: 'MODEL' | 'OFFLINE_FIXTURE' | 'UNSPECIFIED';
}

const choices: Array<{
  value: DecisionChoice;
  label: string;
  description: string;
}> = [
  { value: 'KEEP', label: '维持原判断', description: '这条变化重要，但还没有改变核心判断。' },
  { value: 'WATCH', label: '改为需要重看', description: '先降低确信程度，等后续数据再决定。' },
  { value: 'GATHER', label: '先补证据再决定', description: '目前材料还不够，不急着改结论。' },
  { value: 'INVALIDATE', label: '这条判断已不成立', description: '这次变化已经击穿原来的关键前提。' },
];

const defaultEvidenceGaps = [
  'H20 许可最终是否获得，以及可以恢复多少收入。',
  '55 亿美元预计费用与实际费用会相差多少。',
  '中国以外客户的需求能否抵消这项影响。',
] as const;

function parseDecision(value: string): LocalDecision | null {
  try {
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<LocalDecision> | null;
    if (!parsed || typeof parsed.reason !== 'string' || typeof parsed.decidedAt !== 'string') return null;
    const selected = choices.find((item) => item.value === parsed.choice);
    if (!selected) return null;
    const storedGaps = Array.isArray(parsed.evidenceGaps) ? parsed.evidenceGaps : null;
    const parsedGaps = storedGaps
      ? storedGaps.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).slice(0, 6)
      : [];

    return {
      choice: selected.value,
      label: selected.label,
      reason: parsed.reason,
      stateAfter: getDecisionOutcome(selected.value).stateAfter,
      decidedAt: parsed.decidedAt,
      evidenceGaps: storedGaps ? parsedGaps : [...defaultEvidenceGaps],
      analysisRunId: typeof parsed.analysisRunId === 'string' ? parsed.analysisRunId : null,
      analysisSource: parsed.analysisSource === 'MODEL' || parsed.analysisSource === 'OFFLINE_FIXTURE'
        ? parsed.analysisSource
        : 'UNSPECIFIED',
    };
  } catch {
    return null;
  }
}

function useLocalDecision() {
  const value = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);
      window.addEventListener(decisionEventName, onStoreChange);
      return () => {
        window.removeEventListener('storage', onStoreChange);
        window.removeEventListener(decisionEventName, onStoreChange);
      };
    },
    () => window.localStorage.getItem(decisionStorageKey) || '',
    () => '',
  );

  return parseDecision(value);
}

function writeDecision(decision: LocalDecision) {
  window.localStorage.setItem(decisionStorageKey, JSON.stringify(decision));
  window.dispatchEvent(new Event(decisionEventName));
}

function clearDecision() {
  window.localStorage.removeItem(decisionStorageKey);
  window.dispatchEvent(new Event(decisionEventName));
}

export function CurrentDecisionIndicator({ compact = false }: { compact?: boolean }) {
  const decision = useLocalDecision();
  if (!decision) {
    return <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#dec69c] bg-[#f5ead5] font-bold text-[#8a642f] ${compact ? 'px-2.5 py-1 text-[10px]' : 'px-3.5 py-2 text-[11px]'}`}><CircleHelp size={12} />待我确认</span>;
  }
  if (decision.choice === 'GATHER') {
    return <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#dec69c] bg-[#f5ead5] font-bold text-[#8a642f] ${compact ? 'px-2.5 py-1 text-[10px]' : 'px-3.5 py-2 text-[11px]'}`}><CircleHelp size={12} />先补证据</span>;
  }
  return <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#bfd2c1] bg-[#e2eee2] font-bold text-[#315d47] ${compact ? 'px-2.5 py-1 text-[10px]' : 'px-3.5 py-2 text-[11px]'}`}><Check size={12} />{decision.label}</span>;
}

export function HomeDecisionTask({ eventSummary }: { eventSummary: string }) {
  const decision = useLocalDecision();

  if (decision) {
    const outcome = getDecisionOutcome(decision.choice);
    const gathering = outcome.taskStatus === 'GATHERING';
    return (
      <section className={`mt-8 overflow-hidden rounded-[26px] border shadow-[0_22px_60px_rgb(48_72_55/8%)] ${gathering ? 'border-[#d8c9a9] bg-[#f5ead5]' : 'border-[#cbd8cc] bg-[#edf3ea]'}`}>
        <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-10">
          <div>
            {gathering ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dec69c] bg-[#f5ead5] px-2.5 py-1 text-[10px] font-bold text-[#8a642f]"><CircleHelp size={12} />补证据中 · 还没处理完</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bfd2c1] bg-[#e2eee2] px-2.5 py-1 text-[10px] font-bold text-[#315d47]"><Check size={12} />今天这件事已经处理</span>
            )}
            <h1 className={`mt-5 max-w-3xl font-serif text-[clamp(2.2rem,4.7vw,4.2rem)] leading-[1.02] tracking-[-0.04em] ${gathering ? 'text-[#3f3325]' : 'text-[#22342a]'}`}>{gathering ? '这件事还没处理完，先把证据补齐。' : '你已经处理了 H20 变化。'}</h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#607067]">你选择了“{decision.label}”。你写下的理由是：{decision.reason}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={gathering ? '/monitor/nvda#evidence-gaps' : '/thesis/nvda/history'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#214c3e]">{gathering ? '看看还缺什么' : '查看这次处理记录'} <ArrowRight size={15} /></Link>
              <Link href="/thesis/nvda" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bdcabf] bg-white/60 px-5 py-3 text-sm font-semibold text-[#315d47] transition hover:bg-white/90">回看我现在的判断</Link>
            </div>
          </div>
          <aside className={`rounded-[20px] border bg-white/55 p-5 ${gathering ? 'border-[#dfcfb4]' : 'border-[#cad6cb]'}`}>
            <p className="text-[10px] font-bold tracking-[0.09em] text-[#6c7f72]">现在怎么记</p>
            {gathering ? <p className="mt-3 text-sm font-semibold leading-6 text-[#6f542f]">补证据中。原判断暂时保留，但这项任务还没有完成。</p> : <div className="mt-3"><StateBadge state={decision.stateAfter!} large /></div>}
            <div className="mt-5 border-t border-[#d8e0d8] pt-4">
              <p className="text-[10px] font-bold tracking-[0.08em] text-[#7b897f]">这次处理的对象</p>
              <p className="mt-2 text-xs leading-5 text-[#6c7971]">{eventSummary}</p>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-[26px] border border-[#d8c9a9] bg-[#f5ead5] shadow-[0_22px_60px_rgb(80_66_43/8%)]">
      <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#d9ae72] px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-[#5f4525]">今天有 1 件事值得你看</span>
            <CurrentDecisionIndicator compact />
          </div>
          <h1 className="mt-5 max-w-3xl font-serif text-[clamp(2.2rem,4.7vw,4.2rem)] leading-[1.02] tracking-[-0.04em] text-[#2f281f]">一条新限制，可能会改变你对 NVDA 的判断。</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6f604b]">{eventSummary}</p>
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
  );
}

export function HomeThesisHeading() {
  const decision = useLocalDecision();
  const invalidated = decision ? getDecisionOutcome(decision.choice).thesisStatus === 'INVALIDATED' : false;

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.1em] text-[#7d857f]">{invalidated ? '已停止沿用的 NVDA 判断' : '我的 NVDA 判断'}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">{invalidated ? '这是我之前的判断' : '上次我是这样想的'}</h2>
    </div>
  );
}

export function HomeThesisStatement({ coreThesis }: { coreThesis: string }) {
  const decision = useLocalDecision();
  const invalidated = decision ? getDecisionOutcome(decision.choice).thesisStatus === 'INVALIDATED' : false;

  return (
    <div className="mt-5">
      {invalidated && <span className="inline-flex rounded-full border border-[#ddc3b5] bg-[#f3e5dd] px-2.5 py-1 text-[10px] font-bold text-[#8e5a48]">已停止沿用</span>}
      <p className={`${invalidated ? 'mt-3 text-[#6f756f]' : 'text-[#344039]'} font-serif text-xl leading-8`}>{coreThesis}</p>
    </div>
  );
}

export function ResearchDecisionIntro() {
  const decision = useLocalDecision();

  if (!decision) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#7c857f]"><span>NVDA · 待核对</span><span className="text-[#b3b7b3]">/</span><span>依据截至 2025 年 2 月 27 日</span></div>
        <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4vw,3.45rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">这条判断，现在站得住吗？</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">先看结论和最大分歧。想核对细节时，再展开下面的原始依据。</p>
      </div>
    );
  }

  const copy = {
    KEEP: {
      status: '已核对',
      title: '这条判断核对过了，目前仍然保留。',
      description: '下面保留的是变化发生前的研究快照；你这次选择维持原判断。',
    },
    WATCH: {
      status: '需要重看',
      title: '这条判断已经改为需要重看。',
      description: '下面保留的是原判断当时依据什么成立，便于继续核对哪些前提正在变弱。',
    },
    GATHER: {
      status: '补证据中',
      title: '还缺哪些材料，才能继续判断？',
      description: '你还没有形成新结论。原判断暂时保留，先把关键缺口补齐。',
    },
    INVALIDATE: {
      status: '已不成立',
      title: '这条判断已经不再沿用。',
      description: '下面只是原判断的研究快照，用来解释它当时为什么成立，不再代表当前结论。',
    },
  }[decision.choice];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#7c857f]"><span>NVDA · {copy.status}</span><span className="text-[#b3b7b3]">/</span><span>原研究快照截至 2025 年 2 月 27 日</span></div>
      <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4vw,3.45rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">{copy.title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">{copy.description}</p>
    </div>
  );
}

export function ResearchDecisionContext({ fallbackThesis }: { fallbackThesis: string }) {
  const decision = useLocalDecision();
  const gathering = decision?.choice === 'GATHER';
  const invalidated = decision?.choice === 'INVALIDATE';

  const contextLabel = invalidated
    ? '我已经停止沿用的原判断'
    : gathering
      ? '我暂时保留的原判断'
      : decision
        ? '变化发生前，我核对的是这句话'
        : '我在验证这句话';

  const resultTitle = invalidated
    ? '这条判断已不成立'
    : gathering
      ? '还没有形成新结论'
      : decision
        ? `我选择了“${decision.label}”`
        : '需求和产品放量有实际数据支撑，但利润率、竞争和市场准入都要求保留意见。';

  return (
    <section className={`mt-8 rounded-[24px] border p-5 sm:p-7 ${gathering ? 'border-[#d8c9a9] bg-[#f7edd9]' : invalidated ? 'border-[#dfc8bb] bg-[#f6eae4]' : 'border-[#cfd8cf] bg-[#edf2eb]'}`}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <p className="text-[10px] font-bold tracking-[0.08em] text-[#5d7665]">{contextLabel}</p>
          <p className="mt-3 max-w-3xl font-serif text-xl leading-8 text-[#304039]"><SavedDraftText storageKey={thesisStorageKey} fallback={fallbackThesis} /></p>
          <Link href={invalidated ? '/thesis/nvda/history' : '/idea/nvda'} className="mt-4 inline-flex text-xs font-semibold text-[#315d47] hover:underline">{invalidated ? '回看它当时为什么成立' : '这不是我的意思，回去修改'}</Link>
        </div>
        <div className="rounded-2xl border border-[#d9caa9] bg-white/55 p-5">
          <p className="text-[10px] font-bold tracking-[0.08em] text-[#8a642f]">{decision ? '当前处理结果' : '目前怎么看'}</p>
          <p className="mt-3 text-base font-semibold leading-7 text-[#4b3d2b]">{resultTitle}</p>
          {decision && <p className="mt-3 text-xs leading-5 text-[#77684f]">{decision.reason}</p>}
          {!decision && <p className="mt-3 text-xs leading-5 text-[#77684f]">所以现在可以继续研究，还不能把它当成确定结论。</p>}
          {gathering && (
            <ul className="mt-4 space-y-2 border-t border-[#e3d3b8] pt-4 text-xs leading-5 text-[#77684f]">
              {decision.evidenceGaps.length === 0 ? <li>本次分析没有列出具体缺口，请自行补充。</li> : decision.evidenceGaps.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function ResearchNextAction() {
  const decision = useLocalDecision();

  const next = decision?.choice === 'GATHER'
    ? {
        title: '现有材料还不够，先补齐三项关键缺口。',
        href: '/monitor/nvda#evidence-gaps',
        label: '回到补证据清单',
      }
    : decision?.choice === 'INVALIDATE'
      ? {
          title: '这份材料只保留为原判断的研究快照。',
          href: '/thesis/nvda/history',
          label: '回看处理记录',
        }
      : decision
        ? {
            title: '这份快照仍能解释你为什么这样处理。',
            href: '/thesis/nvda',
            label: '回看我现在的判断',
          }
        : {
            title: '材料已经够你形成一版暂时判断。',
            href: '/thesis/nvda',
            label: '看我现在怎么判断',
          };

  return (
    <section className={`mt-7 flex flex-col gap-4 rounded-[20px] border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${decision?.choice === 'GATHER' ? 'border-[#d8c9a9] bg-[#f7edd9]' : decision?.choice === 'INVALIDATE' ? 'border-[#dfc8bb] bg-[#f6eae4]' : 'border-[#cbd6cc] bg-[#eaf0e8]'}`}>
      <div><p className="text-sm font-semibold text-[#314138]">{next.title}</p><p className="mt-1 flex items-center gap-2 text-xs leading-5 text-[#6c786f]"><Clock3 size={13} />原研究快照截至 2025 年 2 月 27 日</p></div>
      <Link href={next.href} className="inline-flex min-w-max items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgb(23_62_50/18%)] transition hover:bg-[#214c3e]">{next.label} <ArrowRight size={15} /></Link>
    </section>
  );
}

export function CurrentThesisStatement({ coreThesis }: { coreThesis: string }) {
  const decision = useLocalDecision();

  if (decision?.choice === 'INVALIDATE') {
    return (
      <div>
        <p className="text-[10px] font-bold tracking-[0.08em] text-[#8e5a48]">我现在的结论</p>
        <p className="mt-3 font-serif text-[clamp(1.4rem,2.6vw,2.05rem)] leading-[1.35] tracking-[-0.02em] text-[#4a342d]">这条判断已经不成立，不再作为我的当前判断。</p>
        <details className="group mt-4 rounded-xl border border-[#dfcfc6] bg-white/55 p-4">
          <summary className="cursor-pointer list-none text-xs font-semibold text-[#7a594a]">回看已停止沿用的原判断</summary>
          <p className="mt-3 text-sm leading-6 text-[#6f6b66]">{coreThesis}</p>
        </details>
      </div>
    );
  }

  const gathering = decision?.choice === 'GATHER';
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.08em] text-[#64766a]">{gathering ? '暂时保留的原判断' : '我目前怎么判断'}</p>
      <p className="mt-3 font-serif text-[clamp(1.4rem,2.6vw,2.05rem)] leading-[1.35] tracking-[-0.02em] text-[#2b3931]">{coreThesis}</p>
      {gathering && <p className="mt-3 text-xs leading-5 text-[#7a6a50]">正在补证据，尚未形成新的判断。</p>}
    </div>
  );
}

export function ThesisPageIntro() {
  const decision = useLocalDecision();
  const title = decision?.choice === 'INVALIDATE'
    ? '这条判断为什么不再成立。'
    : decision?.choice === 'GATHER'
      ? '我暂时保留原判断，还缺什么材料。'
      : '我现在怎么看，以及什么会让我改主意。';

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.08em] text-[#7c857f]">NVDA · 我的判断</p>
      <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4vw,3.45rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">{title}</h1>
    </div>
  );
}

export function ActiveThesisBody({ children }: { children: ReactNode }) {
  const decision = useLocalDecision();

  if (decision?.choice === 'INVALIDATE') {
    return (
      <div className="p-5 sm:p-7">
        <section className="rounded-[20px] border border-[#dfc8bb] bg-[#f6eae4] p-5 sm:p-6">
          <p className="text-[10px] font-bold tracking-[0.08em] text-[#8e5a48]">原判断已归档</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">旧依据和跟踪条件不再作为当前任务。</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f625c]">你写下的理由已经保存在处理记录里。原判断和当时的材料仍可回看，但这里不会再把它们包装成正在生效的结论。</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/thesis/nvda/history" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white">查看处理记录 <ArrowRight size={14} /></Link>
            <Link href="/monitor/nvda" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d4c5bc] bg-white/60 px-5 py-2.5 text-sm font-semibold text-[#6c5145]">回看这次变化</Link>
          </div>
        </section>
      </div>
    );
  }

  return <>{children}</>;
}

export function MonitorDecisionIntro() {
  const decision = useLocalDecision();
  if (!decision) {
    return (
      <div>
        <p className="text-xs font-semibold tracking-[0.08em] text-[#7c857f]">NVDA · 待我确认</p>
        <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4vw,3.45rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">有一件新变化，需要你决定怎么处理。</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">这里不会自动替你改判断。先看发生了什么、影响哪条前提、还缺什么，再由你选择。</p>
      </div>
    );
  }

  const gathering = decision.choice === 'GATHER';
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.08em] text-[#7c857f]">NVDA · {gathering ? '补证据中' : '已处理'}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4vw,3.45rem)] leading-[1.05] tracking-[-0.035em] text-[#17251f]">{gathering ? '你决定先补证据，再回来处理这件事。' : '这件变化已经处理过，可以随时重新判断。'}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f7872]">你上次选择了“{decision.label}”，理由是：{decision.reason}</p>
    </div>
  );
}

export function DecisionStatusPanel() {
  const decision = useLocalDecision();
  return (
    <div className="rounded-[22px] border border-[#d8c9a9] bg-[#f5ead5] p-5">
      <p className="text-[10px] font-bold tracking-[0.08em] text-[#8a642f]">这件事现在的处理状态</p>
      <div className="mt-4"><CurrentDecisionIndicator /></div>
      <p className="mt-4 text-xs leading-5 text-[#74644f]">{!decision ? '在你明确选择前，原判断不会被覆盖，也不会生成新记录。' : decision.choice === 'GATHER' ? '原判断暂时保留；等材料补齐后，再回来决定是否需要修改。' : '你的选择已经写入处理记录；原判断仍然保留，可以随时回看。'}</p>
    </div>
  );
}

export function ThesisDecisionStatus({ fallbackState }: { fallbackState: ThesisState }) {
  const decision = useLocalDecision();
  const state = decision?.stateAfter ?? fallbackState;
  return (
    <div className="flex flex-wrap gap-4 lg:justify-end">
      <div><p className="mb-1.5 text-[9px] font-bold tracking-[0.08em] text-[#88908a]">{decision?.stateAfter ? '当前判断' : '原判断'}</p><StateBadge state={state} large /></div>
      <div><p className="mb-1.5 text-[9px] font-bold tracking-[0.08em] text-[#88908a]">H20 变化</p><CurrentDecisionIndicator /></div>
    </div>
  );
}

export function ThesisDecisionCard() {
  const decision = useLocalDecision();
  if (!decision) {
    return (
      <div className="rounded-2xl border border-[#dacda9] bg-[#f5ead5] p-4">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8a642f]"><CircleHelp size={13} />有一件事还在等我确认</div>
        <p className="mt-2 text-xs leading-5 text-[#776449]">新的 H20 出口许可要求已经带来预计费用，但还不足以单独否定全球需求。</p>
        <Link href="/monitor/nvda" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7b5d31] hover:underline">去处理这次变化 <ArrowRight size={12} /></Link>
      </div>
    );
  }

  const gathering = decision.choice === 'GATHER';
  return (
    <div className={`rounded-2xl border p-4 ${gathering ? 'border-[#dacda9] bg-[#f5ead5]' : 'border-[#c7d6c9] bg-[#e9f0e7]'}`}>
      <div className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] ${gathering ? 'text-[#8a642f]' : 'text-[#4f7059]'}`}>{gathering ? <CircleHelp size={13} /> : <Check size={13} />}{gathering ? '这件事已转入补证据' : '这件事已经处理'}</div>
      <p className={`mt-2 text-xs font-semibold leading-5 ${gathering ? 'text-[#776449]' : 'text-[#506158]'}`}>你选择了“{decision.label}”。</p>
      <p className={`mt-2 text-xs leading-5 ${gathering ? 'text-[#776449]' : 'text-[#68766e]'}`}>{decision.reason}</p>
      <Link href={gathering ? '/monitor/nvda#evidence-gaps' : '/thesis/nvda/history'} className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${gathering ? 'text-[#7b5d31]' : 'text-[#315d47]'}`}>{gathering ? '查看还缺什么' : '查看处理记录'} <ArrowRight size={12} /></Link>
    </div>
  );
}

function SavedDecisionReview({ decision }: { decision: LocalDecision }) {
  const gathering = decision.choice === 'GATHER';
  return (
    <section className={`rounded-[22px] border p-5 sm:p-6 ${gathering ? 'border-[#d8c9a9] bg-[#f5ead5]' : 'border-[#cbd6cc] bg-[#edf2eb]'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`text-[10px] font-bold tracking-[0.08em] ${gathering ? 'text-[#8a642f]' : 'text-[#58705f]'}`}>{gathering ? '这件事还没处理完' : '这次判断已经记下'}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{decision.label}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#59655e]">{decision.reason}</p>
        </div>
        <button type="button" onClick={clearDecision} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5f6d64] hover:text-[#315d47]"><RotateCcw size={13} />重新判断</button>
      </div>
      {gathering && (
        <div id="gather-next-step" className="mt-5 rounded-xl border border-[#dfcfb4] bg-white/55 p-4">
          <p className="text-[10px] font-bold tracking-[0.08em] text-[#8a642f]">补齐这些材料，再回来决定</p>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-[#74644f]">{decision.evidenceGaps.length === 0 ? <li>本次分析没有列出具体缺口，请自行补充。</li> : decision.evidenceGaps.map((item) => <li key={item}>• {item}</li>)}</ul>
        </div>
      )}
      <div className="mt-5 flex flex-col gap-3 border-t border-[#d9dfd8] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-5 text-[#7a837d]">{gathering ? '这是一条处理中记录，不是判断修改；原判断仍然保留。' : '这是历史情境演示；记录只保存在当前浏览器。'} {decision.analysisSource === 'MODEL' ? '本次参考了真实模型整理草稿。' : decision.analysisSource === 'OFFLINE_FIXTURE' ? '本次参考了明确标注的离线预置分析。' : ''}</p>
        {gathering ? (
          <button type="button" onClick={clearDecision} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]">材料够了，重新做决定 <ArrowRight size={15} /></button>
        ) : (
          <Link href="/thesis/nvda/history" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]">看看这次判断如何被记下 <ArrowRight size={15} /></Link>
        )}
      </div>
    </section>
  );
}

export function DecisionReview({
  evidenceGaps = [...defaultEvidenceGaps],
  analysisRunId = null,
  analysisSource = 'UNSPECIFIED',
  analysisReady = true,
}: {
  evidenceGaps?: string[];
  analysisRunId?: string | null;
  analysisSource?: LocalDecision['analysisSource'];
  analysisReady?: boolean;
}) {
  const existing = useLocalDecision();
  const [choice, setChoice] = useState<DecisionChoice | null>(null);
  const [reason, setReason] = useState('');

  if (existing) return <SavedDecisionReview decision={existing} />;

  if (!analysisReady) {
    return (
      <section className="rounded-[22px] border border-dashed border-[#c8cec7] bg-[#f8f8f4] p-5 sm:p-6">
        <p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">人的决定留在最后</p>
        <h2 className="mt-2 text-lg font-semibold text-[#3b4840]">先把来源事实和原判断对照清楚</h2>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#747d77]">模型整理成功，或你明确加载离线预置示例后，这里才会开放判断选项。系统不会提前替你选择。</p>
      </section>
    );
  }

  const save = () => {
    const selected = choices.find((item) => item.value === choice);
    if (!selected || reason.trim().length < 8) return;
    const outcome = getDecisionOutcome(selected.value);
    writeDecision({
      choice: selected.value,
      label: selected.label,
      reason: reason.trim(),
      stateAfter: outcome.stateAfter,
      decidedAt: '2025-04-16T12:00:00.000Z',
      evidenceGaps: evidenceGaps.slice(0, 6),
      analysisRunId,
      analysisSource,
    });
  };

  return (
    <section className="rounded-[22px] border border-[#cbd6cc] bg-[#edf2eb] p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-bold tracking-[0.08em] text-[#58705f]">轮到我做决定</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">这次变化，要不要让我改判断？</h2>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#6c786f]">材料已经整理好，但系统不会替你改结论。先选一个处理方式，再写下理由。</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {choices.map((item) => {
          const selected = choice === item.value;
          return (
            <button key={item.value} type="button" onClick={() => setChoice(item.value)} className={`rounded-xl border p-4 text-left transition ${selected ? 'border-[#557661] bg-white shadow-[0_8px_20px_rgb(48_60_52/7%)]' : 'border-[#d7ddd5] bg-[#f8f9f5] hover:border-[#aebcaf]'}`}>
              <span className="flex items-center gap-2 text-sm font-semibold text-[#344039]"><span className={`grid h-5 w-5 place-items-center rounded-full border ${selected ? 'border-[#315d47] bg-[#315d47] text-white' : 'border-[#c8cec7] bg-white text-transparent'}`}><Check size={11} /></span>{item.label}</span>
              <span className="mt-2 block pl-7 text-xs leading-5 text-[#747d77]">{item.description}</span>
            </button>
          );
        })}
      </div>

      <label htmlFor="decision-reason" className="mt-5 block text-xs font-semibold text-[#526057]">我这样决定，是因为</label>
      <textarea id="decision-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="例如：影响已经落地，但全球需求和 Blackwell 采用情况还没有转弱……" className="mt-2 min-h-24 w-full rounded-xl border border-[#d5d9d2] bg-white px-4 py-3 text-sm leading-6 text-[#344039] outline-none transition placeholder:text-[#a0a7a2] focus:border-[#789481] focus:ring-2 focus:ring-[#dce8dd]" />

      <div className="mt-5 flex flex-col gap-3 border-t border-[#d9dfd8] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-5 text-[#7a837d]">这是历史情境演示；选择只保存在当前浏览器，不会发送或交易。</p>
        <button type="button" disabled={!choice || reason.trim().length < 8} onClick={save} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e] disabled:cursor-not-allowed disabled:bg-[#b9c0bb]">记下这次判断 <ArrowRight size={15} /></button>
      </div>
    </section>
  );
}

export function LocalDecisionHistory() {
  const decision = useLocalDecision();
  if (!decision) {
    return (
      <section className="rounded-[20px] border border-dashed border-[#c9d0c8] bg-[#f8f8f4] p-5 sm:p-6">
        <p className="text-sm font-semibold text-[#3b4840]">目前还没有第二次判断。</p>
        <p className="mt-2 text-xs leading-5 text-[#747d77]">H20 变化仍在等你确认，所以系统没有擅自创建新版本。</p>
        <Link href="/monitor/nvda" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#315d47] hover:underline">去处理这次变化 <ArrowRight size={13} /></Link>
      </section>
    );
  }

  if (decision.choice === 'GATHER') {
    return (
      <article className="rounded-[22px] border border-[#d8c9a9] bg-[#faf5eb] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#8a7b66]">4 月 16 日 · 我先停下来补证据</p><h2 className="mt-2 text-lg font-semibold">尚未形成新的判断</h2></div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#dec69c] bg-[#f5ead5] px-3 py-1.5 text-[10px] font-bold text-[#8a642f]">处理中</span>
        </div>
        <div className="mt-5 rounded-xl border border-[#e1d7c9] bg-white/70 p-4">
          <p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">我为什么还不下结论</p>
          <p className="mt-2 text-sm leading-6 text-[#4f5953]">{decision.reason}</p>
        </div>
        <p className="mt-4 text-[11px] leading-5 text-[#7f786d]">这是一条操作记录，不是判断修改；原判断保持不变。{decision.analysisSource === 'MODEL' ? '当时参考了真实模型整理草稿。' : decision.analysisSource === 'OFFLINE_FIXTURE' ? '当时参考了离线预置分析。' : ''}</p>
        <Link href="/monitor/nvda#evidence-gaps" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7b5d31] hover:underline">看看还缺什么 <ArrowRight size={13} /></Link>
      </article>
    );
  }

  return (
    <article className="rounded-[22px] border border-[#d8c9a9] bg-[#faf5eb] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-[10px] font-bold tracking-[0.08em] text-[#8a7b66]">4 月 16 日 · 我处理了 H20 限制</p><h2 className="mt-2 text-lg font-semibold">{decision.label}</h2></div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#dec69c] bg-[#f5ead5] px-3 py-1.5 text-[10px] font-bold text-[#8a642f]">我的选择</span>
      </div>
      <div className="mt-5 rounded-xl border border-[#e1d7c9] bg-white/70 p-4">
        <p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">我当时的理由</p>
        <p className="mt-2 text-sm leading-6 text-[#4f5953]">{decision.reason}</p>
      </div>
      <p className="mt-4 text-[11px] leading-5 text-[#7f786d]">本地演示记录 · 原判断仍可在下方回看 · {decision.analysisSource === 'MODEL' ? '参考了真实模型整理草稿' : decision.analysisSource === 'OFFLINE_FIXTURE' ? '参考了离线预置分析' : '分析来源未记录'}</p>
    </article>
  );
}
