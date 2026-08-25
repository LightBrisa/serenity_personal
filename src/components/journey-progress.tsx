import Link from 'next/link';
import { Check } from 'lucide-react';

const steps = [
  { label: 'Idea', href: '/' },
  { label: 'Breakdown', href: '/idea/nvda' },
  { label: 'Research', href: '/research/nvda' },
  { label: 'Thesis', href: '/thesis/nvda' },
  { label: 'Monitor', href: '/monitor/nvda' },
];

export function JourneyProgress({ current }: { current: 'Idea' | 'Breakdown' | 'Research' | 'Thesis' | 'Monitor' }) {
  const currentIndex = steps.findIndex((step) => step.label === current);
  return (
    <nav aria-label="Research journey" className="overflow-x-auto rounded-xl border border-[#d9ddd5] bg-[#f8f8f4] px-3">
      <ol className="flex min-w-[580px] items-center">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={step.label} className="flex flex-1 items-center last:flex-none">
              <Link href={step.href} aria-current={active ? 'step' : undefined} className={`flex items-center gap-2 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] ${active ? 'text-[#315d47]' : complete ? 'text-[#5f7466]' : 'text-[#9aa19c]'}`}>
                <span className={`grid h-5 w-5 place-items-center rounded-full border text-[9px] ${active ? 'border-[#315d47] bg-[#315d47] text-white' : complete ? 'border-[#9db2a1] bg-[#e1ebe0] text-[#315d47]' : 'border-[#d2d6d0] bg-white'}`}>
                  {complete ? <Check size={11} strokeWidth={2.5} /> : index + 1}
                </span>
                {step.label}
              </Link>
              {index < steps.length - 1 && <span className={`mx-3 h-px flex-1 ${index < currentIndex ? 'bg-[#afc3b2]' : 'bg-[#dadcd7]'}`} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
