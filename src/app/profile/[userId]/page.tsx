'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Zap, Flame, Target, Swords, UserPlus, Check, MessageCircle, Loader2, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { LeagueShield, getLeagueLabel } from '@/components/ui/LeagueShield';
import { getLevelInfo } from '@/lib/game';
import { useStore } from '@/store/useStore';
import type { UserProfile, League } from '@/types';

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const { session, status } = useRequireAuth();
  const currentUser = useStore((s) => s.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);
  const [xpData, setXpData] = useState<{ date: string; xp: number }[]>([]);
  const [myXpData, setMyXpData] = useState<{ date: string; xp: number }[]>([]);

  useEffect(() => {
    if (status !== 'authenticated' || !userId) return;

    Promise.all([
      fetch(`/api/users/${userId}`).then((r) => r.json()),
      fetch('/api/friends').then((r) => r.json()),
      fetch(`/api/xp?userId=${userId}`).then((r) => r.json()),
      session?.user?.id ? fetch(`/api/xp?userId=${session.user.id}`).then((r) => r.json()) : Promise.resolve({ chartData: [] }),
    ])
      .then(([userData, friendsData, xpResult, myXpResult]) => {
        if (userData?.id) setProfile(userData);
        if (Array.isArray(friendsData)) {
          setIsFriend(friendsData.some((f: any) => f.status === 'ACCEPTED' && (f.requesterId === userId || f.addresseeId === userId)));
        }
        setXpData(xpResult?.chartData || []);
        setMyXpData(myXpResult?.chartData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, userId, session?.user?.id]);

  const handleSendRequest = async () => {
    setFriendLoading(true);
    const res = await fetch('/api/friends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresseeId: userId }),
    });
    if (res.ok) setIsFriend(true);
    setFriendLoading(false);
  };

  const handleStartChat = async () => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantIds: [userId] }),
    });
    const conv = await res.json();
    if (conv?.id) router.push('/social');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-blue" /></div>;

  if (!profile) return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="glass p-12 text-center">
        <p className="text-text-muted">User not found</p>
      </div>
    </div>
  );

  const levelInfo = getLevelInfo(profile.xp);
  const myLevelInfo = currentUser ? getLevelInfo(currentUser.xp) : null;

  const displayName = profile.name || profile.username || 'Anonymous';

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Profile header */}
        <div className="glass p-6 mb-6">
          <div className="flex items-center gap-5">
            <LeagueShield league={profile.league} size={64} animate />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{displayName}</h1>
                {profile.id === session?.user?.id && (
                  <span className="text-xs px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue">You</span>
                )}
              </div>
              <p className="text-text-muted text-sm">@{profile.username} &middot; {getLeagueLabel(profile.league)}</p>
              {profile.bio && <p className="text-sm mt-2 text-text-secondary">{profile.bio}</p>}
              <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> Level {profile.level}</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {profile.xp.toLocaleString()} XP</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {profile.dailyStreak} day streak</span>
                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {profile.achievementPoints} pts</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartChat}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-blue/10 text-accent-blue text-sm font-medium hover:bg-accent-blue/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              {profile.id !== session?.user?.id && (
                isFriend ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-green/10 text-accent-green text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Friends
                  </div>
                ) : (
                  <button
                    onClick={handleSendRequest}
                    disabled={friendLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-green/10 text-accent-green text-sm font-medium hover:bg-accent-green/20 transition-all disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    {friendLoading ? 'Sending...' : 'Add Friend'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* XP bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Level {levelInfo.level}</span>
              <span>{levelInfo.currentXp} / {levelInfo.xpForNext} XP</span>
            </div>
            <div className="h-2 rounded-full bg-bg-primary/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan transition-all duration-500"
                style={{ width: `${Math.min(levelInfo.progress, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted mt-1">{levelInfo.rank}</p>
          </div>
        </div>

        {/* Comparison with current user */}
        {currentUser && profile.id !== session?.user?.id && (
          <div className="glass p-6 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-accent-cyan" />
              Stats Comparison
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Level', mine: myLevelInfo?.level || 0, theirs: levelInfo.level, icon: Trophy },
                { label: 'XP', mine: currentUser.xp, theirs: profile.xp, icon: Zap, fmt: (v: number) => v.toLocaleString() },
                { label: 'Daily Streak', mine: currentUser.dailyStreak, theirs: profile.dailyStreak, icon: Flame },
                { label: 'Achievement Pts', mine: currentUser.achievementPoints, theirs: profile.achievementPoints, icon: Target },
              ].map((stat) => {
                const Icon = stat.icon;
                const mineVal = stat.fmt ? stat.fmt(stat.mine) : stat.mine;
                const theirVal = stat.fmt ? stat.fmt(stat.theirs) : stat.theirs;
                const diff = stat.mine - stat.theirs;
                return (
                  <div key={stat.label} className="bg-bg-primary/30 rounded-xl p-3 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1 text-text-muted" />
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-accent-blue">You: {mineVal}</p>
                      <p className="text-sm font-semibold text-text-primary">Them: {theirVal}</p>
                    </div>
                    <p className={`text-xs font-medium mt-1 ${diff > 0 ? 'text-accent-green' : diff < 0 ? 'text-accent-red' : 'text-text-muted'}`}>
                      {diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : 'Tied'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* XP history charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-accent-cyan" />
              {displayName}&apos;s XP History
            </h3>
            {xpData.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">No data yet</p>
            ) : (
              <div className="flex items-end gap-1 h-24">
                {xpData.slice(-14).map((d, i) => {
                  const max = Math.max(...xpData.slice(-14).map((p) => p.xp), 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-accent-blue/40 to-accent-cyan/40 hover:from-accent-blue/60 hover:to-accent-cyan/60 transition-all"
                        style={{ height: `${(d.xp / max) * 100}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {currentUser && profile.id !== session?.user?.id && (
            <div className="glass p-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-accent-blue" />
                Your XP History
              </h3>
              {myXpData.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">No data yet</p>
              ) : (
                <div className="flex items-end gap-1 h-24">
                  {myXpData.slice(-14).map((d, i) => {
                    const max = Math.max(...myXpData.slice(-14).map((p) => p.xp), 1);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-accent-purple/40 to-accent-pink/40 hover:from-accent-purple/60 hover:to-accent-pink/60 transition-all"
                          style={{ height: `${(d.xp / max) * 100}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
