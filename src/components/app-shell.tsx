'use client';

import { SafeLink as Link } from './safe-link';
import { usePathname } from 'next/navigation';
import {
  BookOpenText,
  ClipboardList,
  Home,
  ListChecks,
  Search,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}

const navItems: NavItem[] = [
  { label: '今天', href: '/', icon: Home, match: (path) => path === '/' || path.startsWith('/idea') },
  { label: '我的判断', href: '/thesis/nvda', icon: BookOpenText, match: (path) => path === '/thesis/nvda' },
  { label: '判断依据', href: '/research/nvda', icon: ListChecks, match: (path) => path.startsWith('/research') },
  { label: '处理变化', href: '/monitor/nvda', icon: Sparkles, match: (path) => path.startsWith('/monitor') },
  { label: '处理记录', href: '/thesis/nvda/history', icon: ClipboardList, match: (path) => path.includes('/history') },
];

function pageLabel(pathname: string) {
  if (pathname.startsWith('/idea')) return ['先说清楚', '确认自己真正想弄清的问题'];
  if (pathname.startsWith('/research')) return ['判断依据', '回看当时的依据、反证和未知'];
  if (pathname.includes('/history')) return ['处理记录', '回看我何时、为什么处理过判断'];
  if (pathname.startsWith('/thesis')) return ['我的判断', '回看当前结论、原判断和修改条件'];
  if (pathname.startsWith('/monitor')) return ['处理变化', '看清影响，再决定如何处理'];
  return ['今天', '先处理最值得我重新判断的事'];
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [title, subtitle] = pageLabel(pathname);

  return (
    <main className="min-h-screen bg-[#f3f3ee] text-[#18211d]">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <aside className="sticky top-0 hidden h-screen w-[246px] shrink-0 border-r border-[#dcded6] bg-[#f8f8f4] px-5 py-6 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-2 outline-none focus-visible:ring-2 focus-visible:ring-[#6f956e]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#173e32] text-sm font-semibold text-[#e5f0df] shadow-[inset_0_0_0_1px_rgb(255_255_255/10%)]">S</span>
              <span>
                <span className="block font-semibold tracking-[-0.02em]">Serenity</span>
              <span className="block text-[10px] font-medium tracking-[0.12em] text-[#78817b]">帮我想清楚</span>
              </span>
          </Link>

          <nav aria-label="主导航" className="mt-10 space-y-1">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.12em] text-[#8c938e]">我的研究</p>
            {navItems.map((item) => {
              const active = item.match(pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#6f956e] ${
                    active ? 'bg-[#e6ebe4] font-semibold text-[#173e32]' : 'text-[#68716b] hover:bg-[#eceee9] hover:text-[#27312b]'
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#dfe2da] bg-white/70 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-[#334139]">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#e5eae2] text-[#476451]"><Search size={13} /></span>
              研究原则
            </p>
            <p className="mt-2 text-xs leading-5 text-[#737c76]">把事实、表述和推断分开看。</p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-[#476451]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#cf8d45]" />
              演示数据 · 非实时
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-[#dcded6] bg-[#f8f8f4]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#173e32] text-sm font-semibold text-white lg:hidden">S</Link>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{title}</p>
                <p className="hidden truncate text-xs text-[#7d857f] sm:block">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-full border border-[#ddd8ce] bg-[#f8f2e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a6844] sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#cf8d45]" /> 演示
              </span>
            </div>
          </header>

          <nav aria-label="移动端主导航" className="sticky top-[72px] z-30 flex overflow-x-auto border-b border-[#dcded6] bg-[#f8f8f4] px-3 lg:hidden">
            {navItems.map((item) => {
              const active = item.match(pathname);
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className={`flex min-w-max items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold ${active ? 'border-[#315d47] text-[#315d47]' : 'border-transparent text-[#7d857f]'}`}>
                  <Icon size={14} /> {item.label}
                </Link>
              );
            })}
          </nav>

          {children}
        </section>
      </div>
    </main>
  );
}
