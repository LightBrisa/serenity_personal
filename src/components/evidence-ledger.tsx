'use client';

import { CalendarDays, ExternalLink, Filter, Link2, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { EvidenceAssessment, EvidenceRelation, ResearchLayer, SourceRecord } from '@/src/domain/types';
import { Confidence, LayerBadge, RelationBadge, SourceTypeLabel } from './ui';

type RelationFilter = EvidenceRelation | 'ALL';
type LayerFilter = ResearchLayer | 'ALL';

const relationFilters: { label: string; value: RelationFilter }[] = [
  { label: '全部依据', value: 'ALL' },
  { label: '更有信心', value: 'SUPPORTS' },
  { label: '更谨慎', value: 'CHALLENGES' },
  { label: '暂不影响', value: 'NEUTRAL' },
];

const layerFilters: { label: string; value: LayerFilter }[] = [
  { label: '全部维度', value: 'ALL' },
  { label: '生意与财务', value: 'FUNDAMENTALS' },
  { label: '客户、竞争与政策', value: 'INFORMATION' },
  { label: '价格与预期', value: 'MARKET' },
];

export function EvidenceLedger({ evidence, sources }: { evidence: EvidenceAssessment[]; sources: SourceRecord[] }) {
  const [relation, setRelation] = useState<RelationFilter>('ALL');
  const [layer, setLayer] = useState<LayerFilter>('ALL');
  const sourceMap = useMemo(() => Object.fromEntries(sources.map((source) => [source.id, source])), [sources]);
  const visibleEvidence = evidence.filter((item) => (relation === 'ALL' || item.relation === relation) && (layer === 'ALL' || item.layer === layer));

  return (
    <section>
      <div className="flex flex-col gap-3 rounded-[18px] border border-[#d9ddd5] bg-[#f8f8f4] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto">
          {relationFilters.map((item) => (
            <button key={item.value} type="button" onClick={() => setRelation(item.value)} className={`min-w-max rounded-lg px-3 py-2 text-[11px] font-semibold transition ${relation === item.value ? 'bg-[#173e32] text-white shadow-sm' : 'text-[#707973] hover:bg-[#e9ece7]'}`}>
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-[#d9ddd5] bg-white px-3 py-2 text-[11px] font-semibold text-[#67726b]">
          <Filter size={12} />
          <select value={layer} onChange={(event) => setLayer(event.target.value as LayerFilter)} aria-label="按研究维度筛选" className="bg-transparent outline-none">
            {layerFilters.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {visibleEvidence.length === 0 && (
          <div className="grid min-h-48 place-items-center rounded-[18px] border border-dashed border-[#cdd2ca] bg-[#f8f8f4] text-center">
            <div><SearchX className="mx-auto text-[#94a098]" /><p className="mt-3 text-sm font-semibold">没有符合条件的依据</p><button type="button" onClick={() => { setRelation('ALL'); setLayer('ALL'); }} className="mt-2 text-xs font-semibold text-[#315d47] hover:underline">清除筛选</button></div>
          </div>
        )}
        {visibleEvidence.map((item) => {
          const source = sourceMap[item.sourceId];
          return (
            <article key={item.id} className="rounded-[18px] border border-[#d9ddd5] bg-[#fbfbf8] p-5 transition hover:border-[#bec7be]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2"><RelationBadge relation={item.relation} /><LayerBadge layer={item.layer} /></div>
                <Confidence value={item.confidence} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold leading-6 text-[#344039]">{item.title}</h3>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[#dfe2dc] bg-white p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-[#77817a]"><Link2 size={12} /> 原始来源说了什么</div>
                  <p className="mt-2 text-xs leading-5 text-[#59655e]">{source.rawFact}</p>
                </div>
                <div className="rounded-xl border border-[#dbe2d9] bg-[#eff3ed] p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-[#4f6a59]"><span className="grid h-4 w-4 place-items-center rounded bg-[#d9e5d7] text-[9px]">析</span> 这对我的判断意味着什么</div>
                  <p className="mt-2 text-xs leading-5 text-[#526057]">{item.interpretation}</p>
                </div>
              </div>

              <details className="group mt-4 border-t border-[#e2e4df] pt-3">
                <summary className="cursor-pointer list-none text-[11px] font-semibold text-[#7a837d] marker:hidden">局限与出处 <span className="ml-1 inline-block transition group-open:rotate-180">⌄</span></summary>
                <p className="mt-2 text-xs leading-5 text-[#7d857f]">{item.limitations}</p>
              </details>

              <div className="mt-4 flex flex-col gap-3 border-t border-[#e2e4df] pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2"><SourceTypeLabel type={source.type} /><span className="text-[11px] font-semibold text-[#5f6962]">{source.publisher}</span><span className="flex items-center gap-1 text-[10px] text-[#929893]"><CalendarDays size={10} />{new Date(source.publishedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span></div>
                <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#315d47] hover:underline">查看原始来源 <ExternalLink size={11} /></a>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-3 text-right text-[11px] text-[#8b928d]">当前显示 {visibleEvidence.length} / {evidence.length} 条依据</p>
    </section>
  );
}
