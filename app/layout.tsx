import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lora } from 'next/font/google';
import { AppShell } from '@/src/components/app-shell';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const lora = Lora({ variable: '--font-lora', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Serenity — Evidence-led investment research',
  description: 'Turn an investment idea into an evidence-based, falsifiable thesis you can continuously track.',
  openGraph: {
    title: 'Serenity — Evidence-led investment research',
    description: 'Turn an investment idea into an evidence-based, falsifiable thesis you can continuously track.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Serenity — Evidence-led investment research' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serenity — Evidence-led investment research',
    description: 'Turn an investment idea into an evidence-based, falsifiable thesis you can continuously track.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased`}><AppShell>{children}</AppShell></body>
    </html>
  );
}
