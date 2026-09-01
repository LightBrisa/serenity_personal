'use client';

import {
  AlertTriangle,
  CircleHelp,
  ExternalLink,
  Eye,
  LoaderCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import {
  impactAnalysisResultSchema,
  type GeneratedImpactAnalysis,
  type ImpactAnalysisInput,
  type ImpactAnalysisResult,
} from '@/src/ai/impact-analysis';
import type { SourceType } from '@/src/domain/types';
import { DecisionReview } from './decision-experience';
import { SourceTypeLabel } from './ui';

type ExperienceStatus = 'IDLE' | 'RUNNING' | 'READY' | 'FAILED';

const relationCopy = {
  SUPPORTS: { label: '系统识别：可能支持前提', className: 'border-[#bfd2c1] bg-[#e2eee2] text-[#315d47]' },
  CHALLENGES: { label: '系统识别：可能削弱前提', className: 'border-[#e0c8b9] bg-[#f1dfd4] text-[#8e5a43]' },
  NEUTRAL: { label: '暂未识别直接影响', className: 'border-[#d6dad5] bg-[#eceee9] text-[#68736c]' },
} as const;

const effectCopy = {
  STRENGTHENS: { label: '可能得到支持', className: 'bg-[#e4eee3] text-[#3f6950]' },
  WEAKENS: { label: '可能被削弱', className: 'bg-[#f1dfd4] text-[#8e5a43]' },
  UNCLEAR: { label: '方向仍不明确', className: 'bg-[#e8ebe7] text-[#68736c]' },
} as const;

const materialityCopy = {
  HIGH: '可能影响较大',
  MEDIUM: '可能影响中等',
  LOW: '可能影响较小',
} as const;

interface ModelImpactExperienceProps {
  input: ImpactAnalysisInput;
  offlineDraft: GeneratedImpactAnalysis;
  sourceType: SourceType;
  sourceUrl: string;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function makeOfflineResult(
  input: ImpactAnalysisInput,
  offlineDraft: GeneratedImpactAnalysis,
): Promise<ImpactAnalysisResult> {
  return {
    analysis: offlineDraft,
    meta: {
      analysisRunId: 'offline-fixture-h20-v1',
      provider: 'offline-fixture',
      model: 'preset-historical-analysis',
      promptVersion: 'offline-fixture-v1',
      generatedAt: '2025-04-16T12:00:00.000Z',
      inputHash: await sha256(JSON.stringify(input)),
      sourceIds: [input.source.id],
      thesisVersionId: input.thesis.id,
      analysisAsOf: input.analysisAsOf,
      sourceAvailableAt: input.source.availableAt,
      sourceRetrievedAt: input.source.retrievedAt,
      sourceContentHash: await sha256(input.source.rawFact),
      provenanceMode: input.provenanceMode,
    },
  };
}

export function ModelImpactExperience({
  input,
  offlineDraft,
  sourceType,
  sourceUrl,
}: ModelImpactExperienceProps) {
  const [status, setStatus] = useState<ExperienceStatus>('IDLE');
  const [result, setResult] = useState<ImpactAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const analyzeWithModel = async () => {
    setStatus('RUNNING');
    setErrorMessage('');

    try {
      const response = await fetch('/api/ai/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const payload = await response.json() as unknown;

      if (!response.ok) {
        const apiError = payload as { error?: { code?: string; message?: string } };
        const message = apiError.error?.message || '这次没有整理成功，请稍后重试。';
        throw new Error(message);
      }

      const parsed = impactAnalysisResultSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error('服务返回的分析没有通过页面校验。');
      }

      setResult(parsed.data);
      setStatus('READY');
    } catch (error) {
      setResult(null);
      setErrorMessage(error instanceof Error ? error.message : '这次没有整理成功，请稍后重试。');
      setStatus('FAILED');
    }
  };

  const loadOfflineDraft = async () => {
    setResult(await makeOfflineResult(input, offlineDraft));
    setErrorMessage('');
    setStatus('READY');
  };

  const resetAnalysis = () => {
    setResult(null);
    setErrorMessage('');
    setStatus('IDLE');
  };

  const relation = result ? relationCopy[result.analysis.relation] : null;
  const isOffline = result?.meta.provider === 'offline-fixture';
  const assumptionById = new Map(input.assumptions.map((item) => [item.id, item]));

  return (
    <>
      <article className="mt-7 overflow-hidden rounded-[24px] border border-[#d9ddd5] bg-[#fafaf7]">
        <header className="border-b border-[#dedfd9] bg-[#eceee9] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <SourceTypeLabel type={sourceType} />
              <span className="rounded-full bg-[#dde2dc] px-2.5 py-1 text-[10px] font-bold tracking-[0.07em] text-[#657169]">固定历史材料</span>
            </div>
            <span className="text-[11px] text-[#8a918c]">{input.source.publishedAt.replace('T', ' ').slice(0, 16)} UTC</span>
          </div>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-8 tracking-[-0.025em] text-[#344039]">{input.source.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#66716a]">{input.source.rawFact}</p>
          <p className="mt-3 text-[11px] leading-5 text-[#858d87]">上面是来源事实快照；下面的影响判断属于模型或离线样例的推断，不会写回来源记录。{input.provenanceMode === 'RETROSPECTIVE_FIXTURE' ? ' 当前演示为回溯重建，不声称该内容在 2025 年分析时已完成本地抓取。' : ''}</p>
        </header>

        <div className="p-5 sm:p-7">
          {status === 'IDLE' && (
            <section className="rounded-[20px] border border-[#cbd6cc] bg-[#edf2eb] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#315d47]"><Sparkles size={17} /></span>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.08em] text-[#58705f]">模型只负责准备材料</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#344039]">把这份来源和原判断逐项对照</h3>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-[#6c786f]">系统会整理可能受影响的前提、仍缺的证据和分析限制；不会替你选择维持、观察、补证据或停止沿用。</p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 border-t border-[#d9dfd8] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-5 text-[#7a837d]">真实调用使用服务端密钥；浏览器不会拿到 API Key。</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={loadOfflineDraft} className="inline-flex items-center justify-center rounded-xl border border-[#bdcabf] bg-white px-4 py-2.5 text-xs font-semibold text-[#315d47] transition hover:bg-[#f8faf7]">加载离线预置示例</button>
                  <button type="button" onClick={analyzeWithModel} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214c3e]"><Sparkles size={15} />用真实模型整理</button>
                </div>
              </div>
            </section>
          )}

          {status === 'RUNNING' && (
            <section className="rounded-[20px] border border-[#cbd6cc] bg-[#edf2eb] p-6" aria-live="polite">
              <div className="flex items-center gap-3 text-[#315d47]"><LoaderCircle size={18} className="animate-spin" /><p className="text-sm font-semibold">正在对照原判断、关键前提和未知项……</p></div>
              <p className="mt-3 pl-8 text-xs leading-5 text-[#6c786f]">这不是聊天生成；页面会等结构化结果完整通过校验后一次性展示。</p>
            </section>
          )}

          {status === 'FAILED' && (
            <section className="rounded-[20px] border border-[#e0c8b9] bg-[#f7eee8] p-5 sm:p-6" aria-live="polite">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#9a654d]" />
                <div><p className="text-sm font-semibold text-[#63493e]">这次没有整理成功</p><p className="mt-2 text-xs leading-5 text-[#806d64]">{errorMessage} 原始材料、当前判断和处理记录都没有改变。</p></div>
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={loadOfflineDraft} className="rounded-xl border border-[#d4bfae] bg-white/70 px-4 py-2.5 text-xs font-semibold text-[#7a594a]">改看离线预置示例</button>
                <button type="button" onClick={analyzeWithModel} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6f4d3e] px-5 py-2.5 text-sm font-semibold text-white"><RotateCcw size={14} />重试真实调用</button>
              </div>
            </section>
          )}

          {status === 'READY' && result && relation && (
            <div aria-live="polite">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${relation.className}`}>{relation.label}</span>
                    <span className="rounded-full border border-[#d7dad5] bg-[#f1f2ee] px-2.5 py-1 text-[10px] font-bold text-[#68736c]">{materialityCopy[result.analysis.materiality]}</span>
                  </div>
                  <p className="mt-3 text-[10px] font-bold tracking-[0.08em] text-[#58705f]">{isOffline ? '离线预置分析 · 回归样例' : '真实模型分析 · 待你核对'}</p>
                </div>
                <button type="button" onClick={resetAnalysis} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#657169] hover:text-[#315d47]"><RotateCcw size={13} />重新选择整理方式</button>
              </div>

              <p className={`mt-4 rounded-xl border px-4 py-3 text-[11px] leading-5 ${isOffline ? 'border-[#dfcfb4] bg-[#f8f1e5] text-[#806b4e]' : 'border-[#cbd6cc] bg-[#edf2eb] text-[#607067]'}`}>{isOffline ? '当前内容是为了无网络演示而预置的历史样例，本次没有调用模型。' : `本次由 ${result.meta.model} 生成；输入仍是固定历史材料，不是实时研究。`}</p>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#dfe2dc] bg-white p-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><Eye size={13} />这项变化可能意味着什么</div>
                  <p className="mt-3 text-sm leading-6 text-[#536058]">{result.analysis.explanation}</p>
                </div>
                <div className="rounded-2xl border border-[#e0d2c9] bg-[#f7eee8] p-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#8e5e48]"><ShieldAlert size={13} />可能碰到的前提</div>
                  <div className="mt-4 space-y-3">
                    {result.analysis.affectedAssumptions.length === 0 && <p className="text-xs leading-5 text-[#7b6b63]">这次没有识别到直接命中的既有前提。</p>}
                    {result.analysis.affectedAssumptions.map((affected) => {
                      const assumption = assumptionById.get(affected.id);
                      const effect = effectCopy[affected.effect];
                      return (
                        <div key={affected.id} className="rounded-xl bg-white/75 p-3">
                          <div className="flex flex-wrap items-start justify-between gap-2"><p className="max-w-[240px] text-xs font-semibold leading-5 text-[#51453f]">{assumption?.statement}</p><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${effect.className}`}>{effect.label}</span></div>
                          <p className="mt-2 text-[11px] leading-5 text-[#7b6b63]">{affected.rationale}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div id="evidence-gaps" className="rounded-2xl border border-[#d9ddd5] bg-[#f3f4f0] p-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#6f7972]"><CircleHelp size={13} />还缺什么才能判断</div>
                  {result.analysis.evidenceGaps.length === 0 ? <p className="mt-4 text-xs leading-5 text-[#66716a]">模型没有列出额外证据缺口；你仍可以自行补充。</p> : <ul className="mt-4 space-y-3 text-xs leading-5 text-[#66716a]">{result.analysis.evidenceGaps.map((item) => <li key={item}>• {item}</li>)}</ul>}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#d9ddd5] bg-[#f5f6f2] p-5">
                <p className="text-[10px] font-bold tracking-[0.08em] text-[#7d857f]">这份整理有哪些边界</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-[#747d77]">{result.analysis.limitations.map((item) => <li key={item}>• {item}</li>)}</ul>
                <p className="mt-3 border-t border-[#e1e4de] pt-3 text-[11px] leading-5 text-[#7d857f]">系统没有更改原判断或任何前提状态。下面的处理方式和理由仍由你填写。</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 border-t border-[#e1e4de] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2"><SourceTypeLabel type={sourceType} /><span className="text-[11px] font-semibold text-[#5f6962]">{input.source.publisher}</span></div>
            <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#315d47] hover:underline">查看原始来源 <ExternalLink size={11} /></a>
          </div>
        </div>
      </article>

      <div className="mt-7">
        <DecisionReview
          evidenceGaps={result?.analysis.evidenceGaps}
          analysisRunId={result?.meta.analysisRunId}
          analysisSource={isOffline ? 'OFFLINE_FIXTURE' : result ? 'MODEL' : 'UNSPECIFIED'}
          analysisReady={Boolean(result)}
        />
      </div>
    </>
  );
}
