'use client';

import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function BreakdownEditor({ defaultThesis, defaultHorizon }: { defaultThesis: string; defaultHorizon: string }) {
  const router = useRouter();
  const [thesis, setThesis] = useState(defaultThesis);
  const [horizon, setHorizon] = useState(defaultHorizon);
  const [confirmed, setConfirmed] = useState(true);

  const reset = () => {
    setThesis(defaultThesis);
    setHorizon(defaultHorizon);
    setConfirmed(true);
  };

  return (
    <div className="rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#7d857f]">Editable interpretation</p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em]">Current thesis hypothesis</h2>
        </div>
        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6d786f] hover:text-[#315d47]"><RotateCcw size={13} /> Reset</button>
      </div>

      <label htmlFor="core-thesis" className="mt-6 block text-xs font-semibold text-[#526057]">Core thesis</label>
      <textarea id="core-thesis" value={thesis} onChange={(event) => setThesis(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-[#d5d9d2] bg-white px-4 py-3 text-sm leading-6 text-[#344039] outline-none transition focus:border-[#789481] focus:ring-2 focus:ring-[#dce8dd]" />

      <div className="mt-5 grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <label htmlFor="horizon" className="block text-xs font-semibold text-[#526057]">Expected horizon</label>
          <select id="horizon" value={horizon} onChange={(event) => setHorizon(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5d9d2] bg-white px-3 py-3 text-sm text-[#344039] outline-none focus:border-[#789481]">
            <option>6–12 months</option>
            <option>12–18 months</option>
            <option>18–36 months</option>
          </select>
        </div>
        <label className="mt-1 flex cursor-pointer items-start gap-3 rounded-xl border border-[#dce0d9] bg-[#f2f5f0] px-4 py-3 sm:mt-6">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#315d47]" />
          <span><span className="block text-xs font-semibold text-[#3f4d44]">This interpretation captures the idea I want to investigate</span><span className="mt-1 block text-[11px] leading-4 text-[#7b847e]">You can revise the thesis again after evidence is collected.</span></span>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-[#e1e4de] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-[#647069]"><CheckCircle2 size={14} className="text-[#4d765d]" /> 6 assumptions · 7 research questions extracted</p>
        <button type="button" disabled={!confirmed || thesis.trim().length < 30} onClick={() => router.push('/research/nvda')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgb(23_62_50/18%)] transition hover:bg-[#214c3e] disabled:cursor-not-allowed disabled:bg-[#b9c0bb] disabled:shadow-none">
          Confirm & investigate <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
