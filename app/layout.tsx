import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lora } from 'next/font/google';
import { AppShell } from '@/src/components/app-shell';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const lora = Lora({ variable: '--font-lora', subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://serenity-personal.misavenear.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Serenity — 用证据梳理投资逻辑',
  description: '把零散的投资想法，整理成有证据、可证伪、能持续跟踪的投资论点。',
  openGraph: {
    title: 'Serenity — 用证据梳理投资逻辑',
    description: '把零散的投资想法，整理成有证据、可证伪、能持续跟踪的投资论点。',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Serenity — 用证据梳理投资逻辑' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serenity — 用证据梳理投资逻辑',
    description: '把零散的投资想法，整理成有证据、可证伪、能持续跟踪的投资论点。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased`}><AppShell>{children}</AppShell></body>
    </html>
  );
}
