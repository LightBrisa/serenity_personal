'use client';

import { ArrowRight, ClipboardPaste } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { nvdaIdea } from '@/src/data/nvda-fixtures';
import { ideaStorageKey } from './saved-draft';

export function IdeaCapture() {
  const router = useRouter();
  const [idea, setIdea] = useState(nvdaIdea.rawText);
  const hasIdea = idea.trim().length > 0;

  const continueWithIdea = () => {
    if (!hasIdea) return;
    window.localStorage.setItem(ideaStorageKey, idea.trim());
    router.push('/idea/nvda');
  };

  return (
    <div className="mt-8 rounded-[22px] border border-[#cfd4cc] bg-[#fbfbf8] p-3 shadow-[0_16px_40px_rgb(48_60_52/7%)]">
      <div className="flex items-center gap-2 px-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#7c857f]">
        <ClipboardPaste size={13} /> NVDA 固定案例 · 先写下你听到的说法
      </div>
      <label htmlFor="investment-idea" className="sr-only">投资想法</label>
      <textarea
        id="investment-idea"
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="例如：AI 基础设施投入还会继续增加，因此英伟达仍会受益……"
        className="min-h-28 w-full resize-none bg-transparent px-3 py-3 text-[15px] leading-6 text-[#26322c] outline-none placeholder:text-[#9aa19c]"
      />
      <div className="flex flex-col gap-3 border-t border-[#e3e5df] px-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-[#7d857f]">你的文字会带入下一页；后续前提与证据使用固定案例，不会冒充即时生成。</p>
        <button type="button" disabled={!hasIdea} onClick={continueWithIdea} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgb(23_62_50/18%)] transition hover:bg-[#214c3e] disabled:cursor-not-allowed disabled:bg-[#d6dad4] disabled:text-[#8d938e] disabled:shadow-none">
          带着这句话继续 <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
