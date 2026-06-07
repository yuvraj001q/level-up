'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, ListChecks, Swords, Trophy, Users } from 'lucide-react';
import { StatsCardSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { LeagueShield, getLeagueLabel } from '@/components/ui/LeagueShield';
import { XPBar } from '@/components/ui/XPBar';
import { StreakCounter } from '@/components/ui/StreakCounter';
import { TaskCard } from '@/components/ui/TaskCard';
import { useStore } from '@/store/useStore';
import { getLevelInfo } from '@/lib/game';
import type { Task, Quest, UserProfile, League } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { session, status } = useRequireAuth();
  const { setUser, setTasks, setQuests, setAchievements, setLoading, showXpAnimation, showLevelUpAnimation, showAchievementAnimation, user, tasks, quests, achievements } = useStore();
  const [xpToday, setXpToday] = useState(0);
  const [tasksCompletedToday, setTasksCompletedToday] = useState(0);
  const [leaderboard, setLeaderboard] = useState<{ id: string; name: string; level: number; xp: number; league: League; rank: number | null }[]>([]);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    const userId = session.user.id;
    setLoading(true);

    // Fire all fetches in parallel with individual error isolation
    const fetchJson = (url: string) => fetch(url).then(r => r.json()).catch(() => null);

    Promise.all([
      fetchJson(`/api/users/${userId}`),
      fetchJson(`/api/tasks?userId=${userId}`),
      fetchJson(`/api/quests?userId=${userId}`),
      fetchJson(`/api/achievements?userId=${userId}`),
    ])
      .then(([userData, tasksData, questsData, achievementsData]) => {
        if (userData?.id) setUser(userData as UserProfile);
        if (Array.isArray(tasksData)) setTasks(tasksData);
        if (Array.isArray(questsData)) setQuests(questsData);
        if (Array.isArray(achievementsData)) setAchievements(achievementsData);

        // Fire-and-forget quest generation
        fetch(`/api/quests?userId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action: 'generate_daily' }),
        }).catch(() => {});
        fetch(`/api/quests?userId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action: 'generate_weekly' }),
        }).catch(() => {});

        // XP today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        fetch(`/api/xp?userId=${userId}&since=${today.toISOString()}`)
          .then(r => r.json())
          .then(data => { if (data?.total) setXpToday(data.total); })
          .catch(() => {});

        // Tasks completed today
        const allTasks = (Array.isArray(tasksData) ? tasksData : []) as Task[];
        const todayCompleted = allTasks.filter(t => {
          if (!t.completedAt) return false;
          return new Date(t.completedAt) >= today;
        });
        setTasksCompletedToday(todayCompleted.length);
      })
      .finally(() => setLoading(false));

    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setLeaderboard(data.slice(0, 5)); })
      .catch(() => {});
  }, [status, session, setUser, setTasks, setQuests, setAchievements, setLoading]);

  const handleCompleteTask = async (id: string) => {
    if (!session?.user?.id) return;
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userId: session.user.id, status: 'COMPLETED' }),
    });
    const data = await res.json();
    if (data.task) {
      useStore.getState().updateTask(id, data.task);
      if (data.xpAwarded) {
        showXpAnimation(data.xpAwarded);
        setXpToday((p) => p + data.xpAwarded);
        setTasksCompletedToday((p) => p + 1);
        if (data.user) setUser(data.user);
        if (data.leveledUp) {
          const levelInfo = getLevelInfo((user?.xp || 0) + data.xpAwarded);
          showLevelUpAnimation(levelInfo.level);
        }
      }
      if (data.newAchievements?.length > 0) {
        data.newAchievements.forEach((key: string) => {
          const ach = achievements.find((a) => a.key === key);
          if (ach) showAchievementAnimation(ach.title);
        });
        fetch(`/api/achievements?userId=${session.user.id}`)
          .then((r) => r.json())
          .then(setAchievements);
      }
    }
  };

  const handleCompleteQuest = async (id: string) => {
    if (!session?.user?.id) return;
    const res = await fetch('/api/quests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userId: session.user.id, status: 'COMPLETED' }),
    });
    const data = await res.json();
    if (data.quest) {
      useStore.getState().updateQuest(id, data.quest);
      if (data.xpAwarded) {
        showXpAnimation(data.xpAwarded);
        setXpToday((p) => p + data.xpAwarded);
        if (data.leveledUp) {
          const levelInfo = getLevelInfo((user?.xp || 0) + data.xpAwarded);
          showLevelUpAnimation(levelInfo.level);
        }
      }
      if (data.user) useStore.getState().setUser(data.user);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="skeleton h-8 w-72 mb-2" />
          <div className="skeleton h-4 w-44" />
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-6 w-36 mb-4" />
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
          <div className="space-y-4">
            <div className="skeleton h-6 w-32 mb-4" />
            {[...Array(2)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(user.xp);
  const todayTasks = tasks.filter((t) => {
    if (!t.createdAt) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(t.createdAt) >= today || t.status === 'PENDING';
  });
  const dailyQuests = quests.filter((q) => q.type === 'DAILY' && q.status !== 'COMPLETED');
  const weeklyQuests = quests.filter((q) => q.type === 'WEEKLY' && q.status !== 'COMPLETED');
  const recentAchievements = achievements.filter((a) => a.unlocked).slice(0, 4);
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, <span className="gradient-text">{user.name || 'Champion'}</span>
            </h1>
            <p className="text-text-muted mt-1">Here&apos;s your progress today</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/tasks')}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Generate Tasks
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <XPBar {...levelInfo} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StreakCounter dailyStreak={user.dailyStreak} longestStreak={user.longestStreak} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="glass p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">XP Today</p>
                <p className="text-2xl font-bold text-accent-green">+{xpToday}</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="glass p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-blue/5" />
            <div className="relative flex items-center gap-4">
              <LeagueShield league={user.league} size={52} animate={true} showLabel={false} />
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">Current League</p>
                <p className="text-xl font-bold gradient-text">{getLeagueLabel(user.league)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-accent-blue" />
                Today&apos;s Tasks
              </h2>
              <span className="text-xs text-text-muted">{pendingTasks.length} pending</span>
            </div>
            {todayTasks.length === 0 ? (
              <div className="glass p-8 text-center">
                <p className="text-text-muted">No tasks yet. Generate some AI tasks to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.slice(0, 6).map((task) => (
                  <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
                ))}
              </div>
            )}
          </motion.div>

          {leaderboard.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-purple" />
                  Leaderboard
                </h2>
                <button
                  onClick={() => router.push('/leaderboard')}
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {leaderboard.map((entry, i) => (
                  <div
                    key={entry.id}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-center ${
                      entry.id === session?.user?.id
                        ? 'bg-accent-blue/10 ring-1 ring-accent-blue/30'
                        : 'glass-hover'
                    }`}
                  >
                    <span className={`text-xs font-bold ${
                      i === 0 ? 'text-accent-yellow' : i === 1 ? 'text-text-secondary' : i === 2 ? 'text-accent-orange' : 'text-text-muted'
                    }`}>
                      #{i + 1}
                    </span>
                    <LeagueShield league={entry.league} size={28} animate={false} />
                    <p className="text-xs font-medium truncate w-full">{entry.name || 'Anonymous'}</p>
                    <p className="text-[10px] text-text-muted">Lv.{entry.level} &middot; {entry.xp.toLocaleString()} XP</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Swords className="w-4 h-4 text-accent-orange" />
                Daily Quests
              </h2>
            </div>
            {dailyQuests.length === 0 ? (
              <div className="glass p-8 text-center">
                <p className="text-text-muted">No daily quests available.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dailyQuests.slice(0, 4).map((quest) => (
                  <QuestCard key={quest.id} quest={quest} onComplete={handleCompleteQuest} />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent-green" />
                Achievements
              </h2>
            </div>
            <div className="space-y-2">
              {recentAchievements.length === 0 ? (
                <div className="glass p-6 text-center">
                  <Trophy className="w-8 h-8 mx-auto text-text-muted mb-2" />
                  <p className="text-sm text-text-muted">Complete tasks to unlock achievements</p>
                </div>
              ) : (
                recentAchievements.map((ach) => (
                  <div key={ach.key} className="glass-hover p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-accent-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{ach.title}</p>
                      <p className="text-xs text-text-muted">{ach.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Swords className="w-4 h-4 text-accent-purple" />
                Weekly Quests
              </h2>
            </div>
            {weeklyQuests.length === 0 ? (
              <div className="glass p-6 text-center">
                <p className="text-sm text-text-muted">No weekly quests yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {weeklyQuests.slice(0, 3).map((quest) => (
                  <QuestCard key={quest.id} quest={quest} onComplete={handleCompleteQuest} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function QuestCard({ quest, onComplete }: { quest: Quest; onComplete: (id: string) => void }) {
  const isCompleted = quest.status === 'COMPLETED';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-hover p-3 flex items-start gap-3 ${isCompleted ? 'opacity-60' : ''}`}
    >
      <button onClick={() => onComplete(quest.id)} className="mt-0.5 flex-shrink-0">
        {isCompleted ? (
          <div className="w-5 h-5 rounded-full bg-accent-green flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-text-muted hover:border-accent-blue transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCompleted ? 'line-through text-text-muted' : 'text-text-primary'}`}>
          {quest.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-accent-cyan font-medium">+{quest.xpReward} XP</span>
          {quest.isBonus && <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-orange/10 text-accent-orange">BONUS</span>}
        </div>
      </div>
    </motion.div>
  );
}
