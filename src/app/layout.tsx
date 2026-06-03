import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { XPAnimation } from '@/components/ui/XPAnimation';
import { LevelUpAnimation } from '@/components/ui/LevelUpAnimation';
import { AchievementUnlock } from '@/components/ui/AchievementUnlock';
import { FloatingElements } from '@/components/ui/FloatingElements';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Level Up - Turn your life into a game',
  description: 'Gamified productivity with AI-powered quests, XP, and achievements. Turn your life into a game.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Navbar />
          <MobileNav />
          <FloatingElements />
          <XPAnimation />
          <LevelUpAnimation />
          <AchievementUnlock />
          <main className="md:pl-64 pb-20 md:pb-0 min-h-screen relative z-10">
            {children}
          </main>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
