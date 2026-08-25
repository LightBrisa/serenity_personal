import Link from 'next/link';
import { ArrowRight, Clock3, SearchCheck, ShieldCheck, Sparkles, Telescope } from 'lucide-react';
import { IdeaCapture } from '@/src/components/idea-capture';
import { FixtureNotice, RelationBadge, StateBadge } from '@/src/components/ui';
import { relationCounts } from '@/src/domain/calculations';
import {
  currentNvdaThesisVersion,
  nvdaEvidence,
  nvdaMonitorEvents,
  nvdaThesis,
} from '@/src/data/nvda-fixtures';

export default function Home() {
  const counts = relationCounts(nvdaEvidence);
  const latestEvent = nvdaMonitorEvents[0];

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-9 sm:px-8 lg:px-10 lg:pt-12">
      <FixtureNotice compact />

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_306px]">
        <section>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6d786f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cf8d45]" /> 开始一项研究
          </p>
          <h1 className="max-w-2xl font-serif text-[clamp(2.25rem,4vw,3.85rem)] leading-[1.02] tracking-[-0.035em] text-[#17251f]">
            最近有什么投资想法，值得认真查一查？
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#68716b]">
            把看到的一段观点贴进来，或者直接输入股票代码。先拆开它背后的假设，再看证据是否站得住。
          </p>
          <IdeaCapture />
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[#7b837e]">
            <span className="mr-1">也可以试试</span>
            {['MSFT', 'AMZN', 'META'].map((ticker) => (
              <button key={ticker} type="button" title="当前演示只完整支持 NVDA" className="rounded-full border border-[#d7dad4] bg-[#f8f8f4] px-3 py-1.5 font-semibold text-[#59655e] transition hover:border-[#acb8ae]">
                {ticker}
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-[22px] border border-[#d9ddd5] bg-[#e9ece6] p-5 xl:mt-7">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#6f7972]">研究怎么展开</p>
            <Sparkles size={15} className="text-[#819087]" />
          </div>
          <ol className="mt-6 space-y-5">
            {[
              { index: '01', title: '先把观点说清楚', copy: '把一句判断拆成可以修改、也可以被证伪的假设。', icon: SearchCheck },
              { index: '02', title: '正反两边都查', copy: '既找支持它的事实，也认真寻找反证。', icon: ShieldCheck },
              { index: '03', title: '只跟踪真正重要的事', copy: '关注关键假设和证伪条件，不追每一条新闻。', icon: Telescope },
            ].map(({ index, title, copy, icon: Icon }) => (
              <li key={index} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#d6dbd3] bg-[#f7f7f3] text-[#52685a]"><Icon size={14} /></span>
                <div>
                  <p className="text-sm font-semibold text-[#2d3932]">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#747d77]">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 border-t border-[#d4d9d1] pt-4 text-[11px] leading-5 text-[#747d77]">
            不打神秘分数，也不给买卖信号。每次状态变化都要能说清依据。
          </div>
        </aside>
      </div>

      <section className="mt-14 border-t border-[#d9ddd5] pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[#7d857f]">正在跟踪</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">当前投资论点</h2>
          </div>
          <Link href="/thesis/nvda" className="text-xs font-semibold text-[#315d47] hover:underline">查看论点 <span aria-hidden="true">→</span></Link>
        </div>

        <Link href="/thesis/nvda" className="mt-5 grid gap-5 rounded-[20px] border border-[#d9ddd5] bg-[#fafaf7] p-5 transition hover:-translate-y-0.5 hover:border-[#bec7be] hover:shadow-[0_12px_30px_rgb(48_60_52/6%)] sm:grid-cols-[190px_minmax(0,1fr)_190px] sm:p-6">
          <div className="flex items-center gap-3 sm:border-r sm:border-[#e0e3dd]">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e0e8de] text-sm font-bold text-[#28533f]">NV</span>
            <div>
              <p className="font-semibold">{nvdaThesis.company.replace(' Corporation', '')}</p>
              <p className="text-xs text-[#7c857f]">纳斯达克 · {nvdaThesis.ticker}</p>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StateBadge state={currentNvdaThesisVersion.state} />
              <span className="flex items-center gap-1 text-[11px] text-[#8a918c]"><Clock3 size={11} /> 第 2 版 · 2025 年 4 月 16 日</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#38453e]">{currentNvdaThesisVersion.coreThesis}</p>
          </div>
          <div className="flex items-center gap-5 sm:justify-end">
            <div><p className="text-lg font-semibold text-[#3b694f]">{counts.SUPPORTS}</p><p className="text-[10px] tracking-[0.09em] text-[#818984]">支持</p></div>
            <div><p className="text-lg font-semibold text-[#9a6748]">{counts.CHALLENGES}</p><p className="text-[10px] tracking-[0.09em] text-[#818984]">削弱</p></div>
            <ArrowRight size={16} className="hidden text-[#859088] sm:block" />
          </div>
        </Link>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <Link href="/monitor/nvda" className="group rounded-[20px] border border-[#dfd7cb] bg-[#f8f2e9] p-5 transition hover:border-[#cebda7] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><RelationBadge relation={latestEvent.impact.relation} /><span className="text-[11px] text-[#8a8176]">影响较大 · 已生成新版本</span></div>
            <span className="text-xs font-semibold text-[#8a6541] group-hover:underline">查看影响 →</span>
          </div>
          <h3 className="mt-4 max-w-3xl text-base font-semibold text-[#3a342d]">{latestEvent.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#716960]">{latestEvent.impact.explanation}</p>
        </Link>
        <div className="rounded-[20px] border border-[#d9ddd5] bg-[#f8f8f4] p-5">
          <p className="text-[10px] font-bold tracking-[0.1em] text-[#858d87]">下一项关键检查</p>
          <p className="mt-3 text-sm font-semibold text-[#36433b]">2026 财年第一季度业绩</p>
          <p className="mt-2 text-xs leading-5 text-[#7b837e]">看 Blackwell 增长能否同时带动毛利率企稳。</p>
          <p className="mt-4 text-[11px] font-semibold text-[#52685a]">演示日程 · 5 月 28 日</p>
        </div>
      </section>
    </div>
  );
}
