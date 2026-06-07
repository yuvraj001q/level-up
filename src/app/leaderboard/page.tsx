'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion } from 'framer-motion';
import { Users, Trophy, Zap, Flame, Medal, Crown, Loader2, ArrowUp, Shield, ArrowDown, UserPlus, Check, ExternalLink } from 'lucide-react';
import { LeagueShield, getLeagueLabel, LEAGUE_ORDER } from '@/components/ui/LeagueShield';
import type { League } from '@/types';

interface LeaderboardUser {
  id: string;
  name: string | null;
  username: string | null;
  level: number;
  xp: number;
  rank: string;
  league: League;
  dailyStreak: number;
  achievementPoints: number;
}

type Zone = 'promotion' | 'safe' | 'demotion';

const ZONE_CONFIG: Record<Zone, { label: string; color: string; bg: string; border: string; icon: typeof ArrowUp }> = {
  promotion: {
    label: 'Promotion',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'border-l-accent-green',
    icon: ArrowUp,
  },
  safe: {
    label: 'Safe',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.06)',
    border: 'border-l-accent-blue',
    icon: Shield,
  },
  demotion: {
    label: 'Demotion',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.06)',
    border: 'border-l-accent-red',
    icon: ArrowDown,
  },
};

function getZone(pos: number): Zone {
  if (pos < 5) return 'promotion';
  if (pos < 10) return 'safe';
  return 'demotion';
}

function LeagueSection({ league, users, sessionUserId, sortBy, onSendRequest, friendIds }: {
  league: League;
  users: LeaderboardUser[];
  sessionUserId?: string;
  sortBy: string;
  onSendRequest: (id: string) => void;
  friendIds: Set<string>;
}) {
  const router = useRouter();
  const sorted = [...users].sort((a, b) => {
    if (sortBy === 'streak') return b.dailyStreak - a.dailyStreak;
    if (sortBy === 'achievements') return b.achievementPoints - a.achievementPoints;
    return b.xp - a.xp;
  });

  if (sorted.length === 0) return null;

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-4"
      >
        <LeagueShield league={league} size={40} />
        <div>
          <h2 className="text-lg font-semibold">{getLeagueLabel(league)}</h2>
          <p className="text-xs text-text-muted">{sorted.length} player{sorted.length !== 1 ? 's' : ''}</p>
        </div>
      </motion.div>

      <div className="flex items-center gap-4 mb-3 text-[11px]">
        {(['promotion', 'safe', 'demotion'] as Zone[]).map((z) => {
          const cfg = ZONE_CONFIG[z];
          const Icon = cfg.icon;
          return (
            <div key={z} className="flex items-center gap-1.5" style={{ color: cfg.color }}>
              <Icon className="w-3 h-3" />
              <span>{cfg.label}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5">
        {sorted.map((u, i) => {
          const isMe = u.id === sessionUserId;
          const zone = getZone(i);
          const zc = ZONE_CONFIG[zone];
          const ZoneIcon = zc.icon;
          const isFriend = friendIds.has(u.id);

          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${zc.border} ${
                isMe
                  ? 'bg-accent-blue/10 border border-accent-blue/20'
                  : 'glass hover:bg-white/[0.04]'
              }`}
              style={isMe ? undefined : { borderLeft: `3px solid ${zc.color}40` }}
            >
              <div className="w-7 text-center flex-shrink-0">
                {i === 0 ? <Crown className="w-4 h-4 text-accent-orange mx-auto" />
                  : i === 1 ? <Medal className="w-4 h-4 text-text-muted mx-auto" />
                  : i === 2 ? <Medal className="w-4 h-4 text-accent-orange/60 mx-auto" />
                  : <span className="text-text-muted text-xs font-medium">{i + 1}</span>}
              </div>

              {i < 10 && (
                <div className="flex-shrink-0 w-5 justify-center hidden sm:flex">
                  <ZoneIcon className="w-3.5 h-3.5" style={{ color: zc.color }} />
                </div>
              )}

              <div className="flex-shrink-0">
                <LeagueShield league={u.league} size={32} animate={false} />
              </div>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-white font-bold text-xs flex-shrink-0 cursor-pointer"
                onClick={() => router.push(`/profile/${u.id}`)}>
                {(u.name || u.username)?.[0]?.toUpperCase() || '?'}
              </div>

              <button onClick={() => router.push(`/profile/${u.id}`)} className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {u.name || u.username || 'Anonymous'}
                    {isMe && <span className="text-accent-blue text-xs ml-1.5">(you)</span>}
                  </p>
                  {i < 10 && (
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded hidden sm:inline"
                      style={{ background: `${zc.color}18`, color: zc.color }}
                    >
                      {zc.label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted hidden sm:block">
                  @{u.username || 'unknown'} &middot; Level {u.level} &middot; {u.rank}
                </p>
              </button>

              <div className="text-right flex-shrink-0">
                {sortBy === 'xp' && <p className="text-xs sm:text-sm font-semibold">{u.xp.toLocaleString()} XP</p>}
                {sortBy === 'streak' && <p className="text-xs sm:text-sm font-semibold flex items-center gap-1 justify-end"><Flame className="w-3 h-3 text-accent-orange" />{u.dailyStreak}</p>}
                {sortBy === 'achievements' && <p className="text-xs sm:text-sm font-semibold">{u.achievementPoints} pts</p>}
              </div>

              <button
                onClick={() => router.push(`/profile/${u.id}`)}
                className="p-2 rounded-lg hover:bg-accent-blue/10 text-text-muted hover:text-accent-blue transition-all"
                title="View profile"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {!isMe && (
                isFriend ? (
                  <div className="p-2 text-accent-green" title="Friend">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <button
                    onClick={() => onSendRequest(u.id)}
                    className="p-2 rounded-lg hover:bg-accent-green/10 text-text-muted hover:text-accent-green transition-all"
                    title="Add friend"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                )
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { session, status } = useRequireAuth();
  const router = useRouter();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [friends, setFriends] = useState<{ id: string; otherUser: { id: string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'xp' | 'streak' | 'achievements'>('xp');

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/api/leaderboard').then((r) => r.json()).catch(() => []),
      fetch('/api/friends').then((r) => r.json()).catch(() => []),
    ])
      .then(([usersData, friendsData]) => {
        if (Array.isArray(usersData)) setUsers(usersData);
        if (Array.isArray(friendsData)) setFriends(friendsData.filter((f: any) => f.status === 'ACCEPTED'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  const friendIds = useMemo(() => new Set(friends.map((f) => f.otherUser.id)), [friends]);

  const grouped = useMemo(() => {
    const map: Record<string, LeaderboardUser[]> = {};
    for (const league of LEAGUE_ORDER) map[league] = [];
    for (const u of users) {
      if (map[u.league]) map[u.league].push(u);
    }
    return map;
  }, [users]);

  const handleSendRequest = async (addresseeId: string) => {
    const res = await fetch('/api/friends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresseeId }),
    });
    if (res.ok) {
      const data = await res.json();
      setFriends((prev) => [...prev, data]);
    }
  };

  if (status === 'loading' && loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-blue" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Leaderboard</h1>
        <p className="text-text-muted mt-1">See how you rank — click any player to view their profile and compare stats</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
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

      {LEAGUE_ORDER.map((league) => (
        <LeagueSection
          key={league}
          league={league}
          users={grouped[league]}
          sessionUserId={session?.user?.id}
          sortBy={sortBy}
          onSendRequest={handleSendRequest}
          friendIds={friendIds}
        />
      ))}

      {users.length === 0 && !loading && (
        <div className="glass p-12 text-center">
          <Users className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <p className="text-text-muted">No users yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}
