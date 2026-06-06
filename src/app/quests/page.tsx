'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion } from 'framer-motion';
import { Swords, Loader2, RefreshCw } from 'lucide-react';
import { QuestCard } from '@/components/ui/QuestCard';
import { useStore } from '@/store/useStore';
import { getLevelInfo } from '@/lib/game';
import { CardSkeleton } from '@/components/ui/Skeleton';
import type { Quest, QuestType } from '@/types';

export default function QuestsPage() {
  const { session, status } = useRequireAuth();
  const { quests, setQuests, showXpAnimation, showLevelUpAnimation } = useStore();
  const [activeTab, setActiveTab] = useState<QuestType>('DAILY');
  const [generating, setGenerating] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;
    loadQuests();
  }, [status, session]);

  const loadQuests = async () => {
    if (!session?.user?.id) return;
    fetch(`/api/quests?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => { setQuests(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  };

  const handleGenerate = async () => {
    if (!session?.user?.id) return;
    setGenerating(true);
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        action: activeTab === 'DAILY' ? 'generate_daily' : 'generate_weekly',
      }),
    });
    await loadQuests();
    setGenerating(false);
  };

  const handleComplete = async (id: string) => {
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
        if (data.leveledUp) {
          showLevelUpAnimation(data.leveledUp);
        }
      }
    }
  };

  const filteredQuests = quests.filter((q) => {
    if (activeTab === 'DAILY') return q.type === 'DAILY';
    if (activeTab === 'WEEKLY') return q.type === 'WEEKLY';
    return q.type === 'MONTHLY';
  });

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;

  if (!loaded) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="skeleton h-8 w-28 mb-2" />
          <div className="skeleton h-4 w-44" />
        </div>
        <div className="flex gap-2 mb-6">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-8 w-24 rounded-xl" />)}
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Quests</h1>
            <p className="text-text-muted mt-1">Complete quests to earn bonus XP</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-orange/10 text-accent-orange border border-accent-orange/20 text-sm font-medium hover:bg-accent-orange/20 transition-colors disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Generate
          </motion.button>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 mb-6">
        {(['DAILY', 'WEEKLY', 'MONTHLY'] as QuestType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredQuests.length === 0 ? (
          <div className="glass p-12 text-center">
            <Swords className="w-12 h-12 mx-auto text-text-muted mb-4" />
            <p className="text-text-muted">No quests available. Generate some to get started!</p>
          </div>
        ) : (
          filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
          ))
        )}
      </div>
    </div>
  );
}
