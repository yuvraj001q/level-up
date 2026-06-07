'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Loader2, ListChecks } from 'lucide-react';
import { TaskCard } from '@/components/ui/TaskCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useStore } from '@/store/useStore';
import { getLevelInfo } from '@/lib/game';
import type { Task, TaskDifficulty, Goal } from '@/types';

const GOALS: { value: Goal; label: string }[] = [
  { value: 'FITNESS', label: 'Fitness' },
  { value: 'LEARNING', label: 'Learning' },
  { value: 'CODING', label: 'Coding' },
  { value: 'READING', label: 'Reading' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'SELF_IMPROVEMENT', label: 'Self Improvement' },
  { value: 'NDA_PREPARATION', label: 'NDA Preparation' },
  { value: 'CAREER_GROWTH', label: 'Career Growth' },
  { value: 'COMMUNICATION_SKILLS', label: 'Communication' },
  { value: 'CREATIVITY', label: 'Creativity' },
  { value: 'MINDFULNESS', label: 'Mindfulness' },
  { value: 'PRODUCTIVITY', label: 'Productivity' },
];

const DIFFICULTIES: { value: TaskDifficulty; label: string }[] = [
  { value: 'EASY', label: 'Easy (+10 XP)' },
  { value: 'MEDIUM', label: 'Medium (+25 XP)' },
  { value: 'HARD', label: 'Hard (+50 XP)' },
  { value: 'EPIC', label: 'Epic (+100 XP)' },
  { value: 'LEGENDARY', label: 'Legendary (+250 XP)' },
];

export default function TasksPage() {
  const { session, status } = useRequireAuth();
  const { tasks, setTasks, showXpAnimation, showLevelUpAnimation, showAchievementAnimation, achievements, setAchievements, user } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('MEDIUM');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;
    fetch(`/api/tasks?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => { setTasks(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [status, session, setTasks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !title) return;
    setCreating(true);
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, title, description, difficulty, category, deadline: deadline || null, notes }),
    });
    if (res.ok) {
      const task = await res.json();
      useStore.getState().addTask(task);
      setTitle('');
      setDescription('');
      setDifficulty('MEDIUM');
      setCategory('');
      setDeadline('');
      setNotes('');
      setShowCreate(false);
    }
    setCreating(false);
  };

  const handleGenerateAI = async () => {
    if (!session?.user?.id || !user) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          goals: user.goals,
          level: user.level,
          interests: user.interests,
          streak: user.dailyStreak,
        }),
      });
      if (res.ok) {
        const newTasks = await res.json();
        fetch(`/api/tasks?userId=${session.user.id}`)
          .then((r) => r.json())
          .then(setTasks)
          .catch(() => {});
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleComplete = async (id: string) => {
    if (!session?.user?.id) return;
    const store = useStore.getState();
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userId: session.user.id, status: 'COMPLETED' }),
    });
    const data = await res.json();
    if (data.task) {
      store.updateTask(id, data.task);
      if (data.xpAwarded) {
        store.showXpAnimation(data.xpAwarded);
        if (data.leveledUp) {
          const levelInfo = getLevelInfo(data.user?.xp || 0);
          store.showLevelUpAnimation(levelInfo.level);
        }
      }
      if (data.user) store.setUser(data.user);
      if (data.newAchievements?.length > 0) {
        const allAchievements = store.achievements;
        data.newAchievements.forEach((key: string) => {
          const ach = allAchievements.find((a) => a.key === key);
          if (ach) store.showAchievementAnimation(ach.title);
        });
        fetch(`/api/achievements?userId=${session.user.id}`)
          .then((r) => r.json())
          .then(store.setAchievements);
      }
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'PENDING');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;

  if (!loaded) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="skeleton h-8 w-28 mb-2" />
          <div className="skeleton h-4 w-44" />
        </div>
        <div className="flex gap-2 mb-6">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-8 w-20 rounded-lg" />)}
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tasks</h1>
            <p className="text-text-muted mt-1">Manage and complete your tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateAI}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-purple/10 text-accent-purple border border-accent-purple/20 text-sm font-medium hover:bg-accent-purple/20 transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI Generate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New Task
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Active Tasks */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Active Tasks</h2>
          <span className="text-xs bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded-full">{pendingTasks.length}</span>
        </div>
        <AnimatePresence>
          <div className="space-y-2">
            {pendingTasks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 text-center">
                <ListChecks className="w-12 h-12 mx-auto text-text-muted mb-4" />
                <p className="text-text-muted">No pending tasks. Create one or generate AI tasks!</p>
              </motion.div>
            ) : (
              pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} onComplete={handleComplete} />
              ))
            )}
          </div>
        </AnimatePresence>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-text-muted">Completed</h2>
            <span className="text-xs text-text-muted/60 border border-border-subtle px-2 py-0.5 rounded-full">{completedTasks.length}</span>
          </div>
          <AnimatePresence>
            <div className="space-y-2 opacity-60">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onComplete={handleComplete} />
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-6 w-full max-w-lg"
            >
              <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                    placeholder="What do you want to do?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 resize-none"
                    rows={2}
                    placeholder="Optional details"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                    >
                      <option value="">None</option>
                      {GOALS.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 resize-none"
                    rows={2}
                    placeholder="Any additional notes"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={creating || !title}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
