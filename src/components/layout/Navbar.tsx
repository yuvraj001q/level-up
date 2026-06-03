'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ListChecks,
  Swords,
  Trophy,
  BarChart3,
  Users,
  User,
  LogOut,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/quests', label: 'Quests', icon: Swords },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/leaderboard', label: 'Leaderboard', icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session || pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-bg-secondary/80 backdrop-blur-xl border-r border-border-subtle z-50 flex flex-col">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">Level Up</h1>
            <p className="text-xs text-text-muted">Turn life into a game</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-blue"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-border-subtle space-y-1">
        <Link href="/profile">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </motion.div>
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-red hover:bg-accent-red/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
