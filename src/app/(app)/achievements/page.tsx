'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles, Footprints, Flame, Award, BookOpen, Dumbbell, Hammer, CheckCircle, Target, Star, Crown, TrendingUp, CalendarCheck, CalendarDays, Swords } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CardSkeleton } from '@/components/ui/Skeleton';
import type { Achievement } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  Footprints, Flame, Award, BookOpen, Dumbbell, Hammer,
  CheckCircle, Target, Trophy, TrendingUp, Star, Crown,
  CalendarCheck, CalendarDays, Swords, Sparkles,
};

export default function AchievementsPage() {
  const { session, status } = useRequireAuth();
  const { achievements, setAchievements } = useStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;
    fetch(`/api/achievements?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => { setAchievements(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [status, session, setAchievements]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;

  if (!loaded) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="skeleton h-8 w-44 mb-2" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="mb-8">
          <div className="skeleton h-6 w-24 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
        <div>
          <div className="skeleton h-6 w-20 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Achievements</h1>
        <p className="text-text-muted mt-1">
          {unlocked.length} / {achievements.length} unlocked
        </p>
      </motion.div>

      {unlocked.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent-green" />
            Unlocked
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlocked.map((ach, i) => (
              <motion.div
                key={ach.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-hover p-4 flex items-start gap-3 border-accent-green/20"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const Icon = ICON_MAP[ach.icon];
                    return Icon ? <Icon className="w-5 h-5 text-accent-green" /> : <Trophy className="w-5 h-5 text-accent-green" />;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium">{ach.title}</p>
                  <p className="text-xs text-text-muted">{ach.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-accent-cyan">+{ach.xpReward} XP</span>
                    <span className="text-[10px] text-accent-purple">+{ach.pointsReward} pts</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-text-muted" />
          Locked
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {locked.map((ach, i) => (
            <motion.div
              key={ach.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass p-4 flex items-start gap-3 opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-bg-glass flex items-center justify-center flex-shrink-0">
                {(() => {
                  const Icon = ICON_MAP[ach.icon];
                  return Icon ? <Icon className="w-5 h-5 text-text-muted" /> : <Trophy className="w-5 h-5 text-text-muted" />;
                })()}
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">{ach.title}</p>
                <p className="text-xs text-text-muted">{ach.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
