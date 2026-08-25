import { AlertTriangle, Check, CircleHelp, Minus, ShieldAlert } from 'lucide-react';
import type { EvidenceConfidence, EvidenceRelation, ResearchLayer, SourceType, ThesisState } from '@/src/domain/types';

const relationStyles: Record<EvidenceRelation, string> = {
  SUPPORTS: 'border-[#bfd2c1] bg-[#e2eee2] text-[#315d47]',
  CHALLENGES: 'border-[#dfc5b4] bg-[#f4e8df] text-[#925b3e]',
  NEUTRAL: 'border-[#d6d8d3] bg-[#ebede9] text-[#68716b]',
};

export function RelationBadge({ relation }: { relation: EvidenceRelation }) {
  const Icon = relation === 'SUPPORTS' ? Check : relation === 'CHALLENGES' ? AlertTriangle : Minus;
  const label = { SUPPORTS: '支持', CHALLENGES: '削弱', NEUTRAL: '中性' }[relation];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] ${relationStyles[relation]}`}>
      <Icon size={11} strokeWidth={2.4} aria-hidden="true" /> {label}
    </span>
  );
}

const stateStyles: Record<ThesisState, string> = {
  STRONG: 'border-[#a8c6ae] bg-[#dbeadf] text-[#295b3f]',
  STABLE: 'border-[#bfd2c1] bg-[#e2eee2] text-[#315d47]',
  WATCH: 'border-[#dec69c] bg-[#f5ead5] text-[#8a642f]',
  WEAKENED: 'border-[#dfc5b4] bg-[#f4e8df] text-[#925b3e]',
  INVALIDATED: 'border-[#d5b9b9] bg-[#eddada] text-[#843f3f]',
};

export function StateBadge({ state, large = false }: { state: ThesisState; large?: boolean }) {
  const label = { STRONG: '较强', STABLE: '稳定', WATCH: '需观察', WEAKENED: '转弱', INVALIDATED: '已失效' }[state];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border font-bold tracking-[0.1em] ${stateStyles[state]} ${large ? 'px-3.5 py-2 text-[11px]' : 'px-2.5 py-1 text-[10px]'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {label}
    </span>
  );
}

export const layerLabels: Record<ResearchLayer, string> = {
  FUNDAMENTALS: '基本面',
  INFORMATION: '信息与情绪',
  MARKET: '市场与技术面',
};

export function LayerBadge({ layer }: { layer: ResearchLayer }) {
  return <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7b847e]">{layerLabels[layer]}</span>;
}

const sourceLabels: Record<SourceType, string> = {
  SEC_FILING: 'SEC 申报文件',
  COMPANY_RELEASE: '公司公告',
  EARNINGS_CALL: '管理层表述',
  GOVERNMENT_RELEASE: '政府公告',
  MARKET_DATA: '市场数据',
  ANALYST_OPINION: '分析师观点',
  SOCIAL_OPINION: '社交平台观点',
};

export function SourceTypeLabel({ type }: { type: SourceType }) {
  return <span className="rounded-md bg-[#eceee9] px-2 py-1 text-[10px] font-semibold text-[#66716a]">{sourceLabels[type]}</span>;
}

export function Confidence({ value }: { value: EvidenceConfidence }) {
  const filled = value === 'HIGH' ? 3 : value === 'MEDIUM' ? 2 : value === 'LOW' ? 1 : 0;
  const label = { HIGH: '高', MEDIUM: '中', LOW: '低', UNKNOWN: '未知' }[value];
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.07em] text-[#818984]" title={`可信度：${label}`}>
      可信度
      <span className="flex gap-0.5">
        {[0, 1, 2].map((index) => <span key={index} className={`h-1.5 w-3 rounded-full ${index < filled ? 'bg-[#667e6d]' : 'bg-[#d8dcd6]'}`} />)}
      </span>
    </span>
  );
}

export function AssumptionStatus({ status }: { status: 'HOLDS' | 'UNDER_PRESSURE' | 'UNKNOWN' | 'BROKEN' }) {
  const config = {
    HOLDS: { label: '仍成立', icon: Check, style: 'text-[#3d6b50] bg-[#e4eee3]' },
    UNDER_PRESSURE: { label: '承压', icon: ShieldAlert, style: 'text-[#8a642f] bg-[#f5ead5]' },
    UNKNOWN: { label: '未知', icon: CircleHelp, style: 'text-[#6f7772] bg-[#eceee9]' },
    BROKEN: { label: '已不成立', icon: AlertTriangle, style: 'text-[#8e4940] bg-[#f0deda]' },
  }[status];
  const Icon = config.icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${config.style}`}><Icon size={11} />{config.label}</span>;
}

export function FixtureNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border border-[#e3d7c4] bg-[#f7f0e5] text-[#806541] ${compact ? 'px-3 py-2 text-[11px]' : 'px-4 py-3 text-xs leading-5'}`}>
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      <p><strong>当前为演示数据。</strong>内容来自固定的历史快照，不是实时市场数据，也不构成投资建议。</p>
    </div>
  );
}

export function Unknown({ children }: { children?: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-[#c5c9c3] bg-[#f0f1ed] px-2 py-1 text-[10px] font-bold tracking-[0.08em] text-[#6f7772]">未知{children ? ` · ${children}` : ''}</span>;
}
