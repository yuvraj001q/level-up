'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion } from 'framer-motion';
import { User, Save, Loader2, Zap, Award, Flame, BarChart3 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getLevelInfo } from '@/lib/game';
import type { Goal } from '@/types';

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

export default function ProfilePage() {
  const { session, status, update } = useRequireAuth();
  const { user, setUser } = useStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [bio, setBio] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [interestsStr, setInterestsStr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    fetch(`/api/users/${session.user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setUser(data);
          setName(data.name || '');
          setAge(data.age || '');
          setBio(data.bio || '');
          setSelectedGoals(data.goals || []);
          setInterestsStr((data.interests || []).join(', '));
        }
      });
  }, [status, session, setUser]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        name,
        age: age || null,
        bio,
        goals: selectedGoals,
        interests: interestsStr.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      await update();
    }
    setSaving(false);
  };

  const toggleGoal = (goal: Goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;

  const levelInfo = user ? getLevelInfo(user.xp) : null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-text-muted mt-1">Manage your profile and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass p-6">
              <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                    placeholder="Your age"
                    min={1}
                    max={150}
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 resize-none"
                    rows={3}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass p-6">
              <h2 className="text-lg font-semibold mb-4">Your Goals</h2>
              <p className="text-xs text-text-muted mb-4">Select the areas you want to improve in</p>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleGoal(goal.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedGoals.includes(goal.value)
                        ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                        : 'bg-bg-glass text-text-muted border border-border-subtle hover:text-text-secondary'
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="glass p-6">
              <h2 className="text-lg font-semibold mb-4">Interests</h2>
              <p className="text-xs text-text-muted mb-4">Comma-separated list of your interests (e.g., Yoga, Python, Marketing)</p>
              <input
                value={interestsStr}
                onChange={(e) => setInterestsStr(e.target.value)}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                placeholder="Yoga, Python, Marketing, Reading..."
              />
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <p className="text-lg font-semibold">{user?.name || 'Anonymous'}</p>
              <p className="text-sm text-text-muted">{user?.email}</p>
            </div>
          </motion.div>

          {levelInfo && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="glass p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-accent-blue" />
                  <div>
                    <p className="text-xs text-text-muted">Level {levelInfo.level}</p>
                    <p className="text-sm font-medium">{levelInfo.rank}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-accent-purple" />
                  <div>
                    <p className="text-xs text-text-muted">Achievement Points</p>
                    <p className="text-sm font-medium">{user?.achievementPoints || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Flame className="w-4 h-4 text-accent-orange" />
                  <div>
                    <p className="text-xs text-text-muted">Best Streak</p>
                    <p className="text-sm font-medium">{user?.longestStreak || 0} days</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
