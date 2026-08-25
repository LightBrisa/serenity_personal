'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  BookOpenText,
  CircleHelp,
  ClipboardList,
  FlaskConical,
  LayoutGrid,
  Search,
  Telescope,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: '想法箱', href: '/', icon: LayoutGrid, match: (path) => path === '/' || path.startsWith('/idea') },
  { label: '研究台', href: '/research/nvda', icon: FlaskConical, match: (path) => path.startsWith('/research') },
  { label: '投资论点', href: '/thesis/nvda', icon: BookOpenText, match: (path) => path.startsWith('/thesis') },
  { label: '论点跟踪', href: '/monitor/nvda', icon: Telescope, match: (path) => path.startsWith('/monitor'), badge: '2' },
];

function pageLabel(pathname: string) {
  if (pathname.startsWith('/idea')) return ['想法拆解', '先把观点说清楚，再开始查证'];
  if (pathname.startsWith('/research')) return ['研究台', '同时寻找支持和反对的证据'];
  if (pathname.includes('/history')) return ['论点记录', '什么变了，何时变的，为什么'];
  if (pathname.startsWith('/thesis')) return ['论点卡', '把依据、风险和证伪条件放在一起'];
  if (pathname.startsWith('/monitor')) return ['论点跟踪', '只看真正影响关键假设的变化'];
  return ['想法箱', '把一句判断整理成可验证的投资论点'];
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
              <span className="block text-[10px] font-medium tracking-[0.12em] text-[#78817b]">个人研究台</span>
            </span>
          </Link>

          <nav aria-label="主导航" className="mt-10 space-y-1">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.12em] text-[#8c938e]">研究流程</p>
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
                  {item.badge && <span className="ml-auto rounded-full bg-[#d9e5d4] px-2 py-0.5 text-[10px] font-bold text-[#315d47]">{item.badge}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-[#e1e3dd] pt-5">
            <Link href="/thesis/nvda/history" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#68716b] transition hover:bg-[#eceee9] hover:text-[#27312b]">
              <ClipboardList size={17} aria-hidden="true" />
              判断记录
            </Link>
          </div>

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
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-[#ddd8ce] bg-[#f8f2e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a6844] sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#cf8d45]" /> 演示
              </span>
              <button type="button" aria-label="帮助" className="hidden h-9 w-9 place-items-center rounded-full border border-[#d8dbd4] bg-white text-[#68716b] transition hover:text-[#26322c] sm:grid">
                <CircleHelp size={16} />
              </button>
              <button type="button" aria-label="通知" className="relative grid h-9 w-9 place-items-center rounded-full border border-[#d8dbd4] bg-white text-[#68716b] transition hover:text-[#26322c]">
                <Bell size={16} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#c7804e] ring-2 ring-white" />
              </button>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dce5dc] text-xs font-bold text-[#315443]">AR</span>
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
