import { ArrowDown, ArrowRight } from 'lucide-react';
import type { CausalStep } from '@/src/domain/types';

export function CausalChain({ steps, compact = false }: { steps: CausalStep[]; compact?: boolean }) {
  return (
    <div className={`grid ${compact ? 'gap-2' : 'gap-3'} md:grid-cols-[repeat(7,minmax(0,1fr))] md:items-center`}>
      {steps.map((step, index) => (
        <div key={step.id} className="contents">
          <div className={`rounded-xl border border-[#d9ddd5] bg-[#fafaf7] ${compact ? 'p-3' : 'p-4'}`}>
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#a18462]">Step {index + 1}</span>
            <p className={`${compact ? 'mt-1 text-xs' : 'mt-2 text-sm'} font-semibold leading-5 text-[#334139]`}>{step.label}</p>
            {step.detail && !compact && <p className="mt-1.5 text-[11px] leading-4 text-[#7c857f]">{step.detail}</p>}
          </div>
          {index < steps.length - 1 && (
            <div className="grid place-items-center text-[#8b9a90]">
              <ArrowDown size={15} className="md:hidden" />
              <ArrowRight size={15} className="hidden md:block" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
