'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, ListChecks, Swords, Trophy, BarChart3 } from 'lucide-react';

const MOBILE_NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/quests', label: 'Quests', icon: Swords },
  { href: '/achievements', label: 'Awards', icon: Trophy },
  { href: '/analytics', label: 'Stats', icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session || pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary/90 backdrop-blur-xl border-t border-border-subtle z-50 md:hidden">
      <div className="flex items-center justify-around py-1 px-2">
        {MOBILE_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-accent-blue' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
