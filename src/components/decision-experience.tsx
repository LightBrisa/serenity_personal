'use client';

import Link from 'next/link';
import { ArrowRight, Check, CircleHelp, RotateCcw } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import type { ThesisState } from '@/src/domain/types';
import { StateBadge } from './ui';

const decisionStorageKey = 'serenity-personal:nvda:decision';
const decisionEventName = 'serenity-personal:decision-updated';

type DecisionChoice = 'KEEP' | 'WATCH' | 'GATHER' | 'INVALIDATE';

interface LocalDecision {
  choice: DecisionChoice;
  label: string;
  reason: string;
  stateAfter: 'STABLE' | 'WATCH' | 'INVALIDATED' | null;
  decidedAt: string;
}

const choices: Array<{
  value: DecisionChoice;
  label: string;
  description: string;
  stateAfter: LocalDecision['stateAfter'];
}> = [
  { value: 'KEEP', label: '维持原判断', description: '这条变化重要，但还没有改变核心判断。', stateAfter: 'STABLE' },
  { value: 'WATCH', label: '改为需要重看', description: '先降低确信程度，等后续数据再决定。', stateAfter: 'WATCH' },
  { value: 'GATHER', label: '先补证据再决定', description: '目前材料还不够，不急着改结论。', stateAfter: null },
  { value: 'INVALIDATE', label: '这条判断已不成立', description: '这次变化已经击穿原来的关键前提。', stateAfter: 'INVALIDATED' },
];

function parseDecision(value: string) {
  try {
    return value ? (JSON.parse(value) as LocalDecision) : null;
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
    const gathering = decision.choice === 'GATHER';
    return (
      <section className="mt-8 overflow-hidden rounded-[26px] border border-[#cbd8cc] bg-[#edf3ea] shadow-[0_22px_60px_rgb(48_72_55/8%)]">
        <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bfd2c1] bg-[#e2eee2] px-2.5 py-1 text-[10px] font-bold text-[#315d47]"><Check size={12} />今天这件事已经处理</span>
            <h1 className="mt-5 max-w-3xl font-serif text-[clamp(2.2rem,4.7vw,4.2rem)] leading-[1.02] tracking-[-0.04em] text-[#22342a]">{gathering ? '你决定先补证据，再回来判断。' : '你已经处理了 H20 变化。'}</h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#607067]">你选择了“{decision.label}”。你写下的理由是：{decision.reason}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={gathering ? '/monitor/nvda' : '/thesis/nvda/history'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#214c3e]">{gathering ? '看看还缺什么' : '查看这次修改记录'} <ArrowRight size={15} /></Link>
              <Link href="/thesis/nvda" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bdcabf] bg-white/60 px-5 py-3 text-sm font-semibold text-[#315d47] transition hover:bg-white/90">回看我现在的判断</Link>
            </div>
          </div>
          <aside className="rounded-[20px] border border-[#cad6cb] bg-white/55 p-5">
            <p className="text-[10px] font-bold tracking-[0.09em] text-[#6c7f72]">现在怎么记</p>
            {decision.stateAfter ? <div className="mt-3"><StateBadge state={decision.stateAfter} large /></div> : <p className="mt-3 text-sm font-semibold leading-6 text-[#405047]">原判断暂时保留，这件事转入补证据。</p>}
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
      <p className="mt-4 text-xs leading-5 text-[#74644f]">{!decision ? '在你明确选择前，原判断不会被覆盖，也不会生成新记录。' : decision.choice === 'GATHER' ? '原判断暂时保留；等材料补齐后，再回来决定是否需要修改。' : '你的选择已经写入修改记录；原判断仍然保留，可以随时回看。'}</p>
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
      <Link href={gathering ? '/monitor/nvda' : '/thesis/nvda/history'} className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${gathering ? 'text-[#7b5d31]' : 'text-[#315d47]'}`}>{gathering ? '查看还缺什么' : '查看修改记录'} <ArrowRight size={12} /></Link>
    </div>
  );
}

function SavedDecisionReview({ decision }: { decision: LocalDecision }) {
  const gathering = decision.choice === 'GATHER';
  return (
    <section className={`rounded-[22px] border p-5 sm:p-6 ${gathering ? 'border-[#d8c9a9] bg-[#f5ead5]' : 'border-[#cbd6cc] bg-[#edf2eb]'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`text-[10px] font-bold tracking-[0.08em] ${gathering ? 'text-[#8a642f]' : 'text-[#58705f]'}`}>{gathering ? '这件事已转入补证据' : '这次判断已经记下'}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{decision.label}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#59655e]">{decision.reason}</p>
        </div>
        <button type="button" onClick={clearDecision} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5f6d64] hover:text-[#315d47]"><RotateCcw size={13} />重新判断</button>
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-[#d9dfd8] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-5 text-[#7a837d]">这是历史情境演示；记录只保存在当前浏览器。</p>
        <Link href="/thesis/nvda/history" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]">看看这次判断如何被记下 <ArrowRight size={15} /></Link>
      </div>
    </section>
  );
}

export function DecisionReview() {
  const existing = useLocalDecision();
  const [choice, setChoice] = useState<DecisionChoice | null>(null);
  const [reason, setReason] = useState('');

  if (existing) return <SavedDecisionReview decision={existing} />;

  const save = () => {
    const selected = choices.find((item) => item.value === choice);
    if (!selected || reason.trim().length < 8) return;
    writeDecision({
      choice: selected.value,
      label: selected.label,
      reason: reason.trim(),
      stateAfter: selected.stateAfter,
      decidedAt: '2025-04-16T12:00:00.000Z',
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
      <p className="mt-4 text-[11px] leading-5 text-[#7f786d]">本地演示记录 · 原判断仍可在下方回看</p>
    </article>
  );
}
