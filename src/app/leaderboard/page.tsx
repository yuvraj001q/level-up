'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion } from 'framer-motion';
import { Users, Trophy, Zap, Flame, Medal, Crown, Loader2 } from 'lucide-react';
import { LeagueShield, getLeagueLabel } from '@/components/ui/LeagueShield';
import type { League } from '@/types';

interface LeaderboardUser {
  id: string;
  name: string | null;
  level: number;
  xp: number;
  rank: string;
  league: League;
  dailyStreak: number;
  achievementPoints: number;
}

export default function LeaderboardPage() {
  const { session, status } = useRequireAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'xp' | 'streak' | 'achievements'>('xp');

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }

    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'streak') return b.dailyStreak - a.dailyStreak;
    if (sortBy === 'achievements') return b.achievementPoints - a.achievementPoints;
    return b.xp - a.xp;
  });

  if (status === 'loading' && loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-blue" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Leaderboard</h1>
        <p className="text-text-muted mt-1">See how you rank against others</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-6">
        {([
          { key: 'xp', label: 'XP', icon: Zap },
          { key: 'streak', label: 'Streak', icon: Flame },
          { key: 'achievements', label: 'Achievements', icon: Trophy },
        ] as const).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                sortBy === tab.key
                  ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

            <div className="space-y-2">
        {sortedUsers.length === 0 ? (
          <div className="glass p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-text-muted mb-4" />
            <p className="text-text-muted">No users yet. Be the first!</p>
          </div>
        ) : (
          sortedUsers.map((u, i) => {
            const isMe = u.id === session?.user?.id;
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-hover p-3 flex items-center gap-3 ${
                  isMe ? 'border-accent-blue/30 bg-accent-blue/5' : ''
                }`}
              >
                <div className="w-7 text-center flex-shrink-0">
                  {i === 0 ? <Crown className="w-4 h-4 text-accent-orange mx-auto" />
                    : i === 1 ? <Medal className="w-4 h-4 text-text-muted mx-auto" />
                    : i === 2 ? <Medal className="w-4 h-4 text-accent-orange/60 mx-auto" />
                    : <span className="text-text-muted text-xs">{i + 1}</span>}
                </div>
                <div className="flex-shrink-0">
                  <LeagueShield league={u.league} size={36} />
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {u.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {u.name || 'Anonymous'}
                    {isMe && <span className="text-accent-blue text-xs ml-2">(you)</span>}
                  </p>
                  <p className="text-xs text-text-muted">
                    {getLeagueLabel(u.league)} &middot; Level {u.level}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  {sortBy === 'xp' && <p className="text-sm font-semibold">{u.xp.toLocaleString()} XP</p>}
                  {sortBy === 'streak' && <p className="text-sm font-semibold flex items-center gap-1 justify-end"><Flame className="w-3 h-3 text-accent-orange" />{u.dailyStreak}</p>}
                  {sortBy === 'achievements' && <p className="text-sm font-semibold">{u.achievementPoints} pts</p>}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
