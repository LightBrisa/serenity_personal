'use client';

import Link from 'next/link';
import { BellRing, Check, Telescope } from 'lucide-react';
import { useState } from 'react';

export function FollowControl({ defaultFollowing = true }: { defaultFollowing?: boolean }) {
  const [following, setFollowing] = useState(defaultFollowing);
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button type="button" onClick={() => setFollowing((value) => !value)} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${following ? 'border-[#b9ccb9] bg-[#e1ece0] text-[#315d47]' : 'border-[#173e32] bg-[#173e32] text-white'}`}>
        {following ? <Check size={15} /> : <BellRing size={15} />}{following ? 'Following thesis' : 'Follow this thesis'}
      </button>
      {following && <Link href="/monitor/nvda" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]"><Telescope size={15} /> Open monitor</Link>}
    </div>
  );
}
