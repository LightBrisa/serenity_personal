'use client';

import Link from 'next/link';
import { ArrowRight, Check, CircleHelp, RotateCcw } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';

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
  return <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#bfd2c1] bg-[#e2eee2] font-bold text-[#315d47] ${compact ? 'px-2.5 py-1 text-[10px]' : 'px-3.5 py-2 text-[11px]'}`}><Check size={12} />{decision.label}</span>;
}

function SavedDecisionReview({ decision }: { decision: LocalDecision }) {
  return (
    <section className="rounded-[22px] border border-[#cbd6cc] bg-[#edf2eb] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.08em] text-[#58705f]">这次判断已经记下</p>
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
