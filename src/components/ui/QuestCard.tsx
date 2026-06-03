'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Zap, Swords, Star, Flame } from 'lucide-react';
import type { Quest } from '@/types';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const isCompleted = quest.status === 'COMPLETED';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-hover p-4 flex items-start gap-3 ${
        isCompleted ? 'opacity-60' : ''
      } ${quest.isBonus ? 'border-accent-orange/30' : ''} ${
        quest.isStreakQuest ? 'border-accent-red/30' : ''
      }`}
    >
      <button
        onClick={() => onComplete(quest.id)}
        className="mt-0.5 flex-shrink-0"
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-accent-green" />
        ) : (
          <Circle className="w-5 h-5 text-text-muted hover:text-accent-blue transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${isCompleted ? 'line-through text-text-muted' : 'text-text-primary'}`}>
            {quest.title}
          </p>
          {quest.isBonus && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-orange/10 text-accent-orange border border-accent-orange/20 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5" /> BONUS
            </span>
          )}
          {quest.isStreakQuest && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-red/10 text-accent-red border border-accent-red/20 flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5" /> STREAK
            </span>
          )}
        </div>
        {quest.description && (
          <p className="text-xs text-text-muted mt-1">{quest.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs font-medium text-accent-cyan">
            <Zap className="w-3 h-3 inline mr-0.5" />
            +{quest.xpReward} XP
          </span>
          <span className="text-xs text-text-muted uppercase tracking-wider">
            <Swords className="w-3 h-3 inline mr-0.5" />
            {quest.type}
          </span>
          {quest.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-bg-glass text-text-muted">
              {quest.category}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
