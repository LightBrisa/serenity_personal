'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardPaste, CornerDownLeft } from 'lucide-react';
import { useState } from 'react';
import { nvdaIdea } from '@/src/data/nvda-fixtures';

export function IdeaCapture() {
  const [idea, setIdea] = useState(nvdaIdea.rawText);
  const hasIdea = idea.trim().length > 0;

  return (
    <div className="mt-8 rounded-[22px] border border-[#cfd4cc] bg-[#fbfbf8] p-3 shadow-[0_16px_40px_rgb(48_60_52/7%)]">
      <div className="flex items-center gap-2 px-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#7c857f]">
        <ClipboardPaste size={13} /> Paste an idea, quote, or ticker
      </div>
      <label htmlFor="investment-idea" className="sr-only">Investment idea</label>
      <textarea
        id="investment-idea"
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="Example: AI spending will continue rising, so NVDA should keep benefiting…"
        className="min-h-28 w-full resize-none bg-transparent px-3 py-3 text-[15px] leading-6 text-[#26322c] outline-none placeholder:text-[#9aa19c]"
      />
      <div className="flex flex-col gap-3 border-t border-[#e3e5df] px-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-[#7d857f]">
          {hasIdea ? (
            <>
              <span className="rounded-md border border-[#d9ddd5] bg-white px-2 py-1 font-semibold text-[#4d5951]">NVDA</span>
              <span>Detected from your idea</span>
            </>
          ) : (
            <><CornerDownLeft size={13} /><span>Start with a claim or ticker</span></>
          )}
        </div>
        <Link
          href={hasIdea ? '/idea/nvda' : '#'}
          aria-disabled={!hasIdea}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-[0_6px_16px_rgb(23_62_50/18%)] transition ${hasIdea ? 'bg-[#173e32] text-white hover:bg-[#214c3e]' : 'pointer-events-none bg-[#d6dad4] text-[#8d938e] shadow-none'}`}
        >
          Break down idea <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
