'use client';

import { motion } from 'framer-motion';

interface XPBarProps {
  currentXp: number;
  xpForNext: number;
  progress: number;
  level: number;
  rank: string;
}

export function XPBar({ currentXp, xpForNext, progress, level, rank }: XPBarProps) {
  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider">Level</p>
          <p className="text-3xl font-bold gradient-text">{level}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted uppercase tracking-wider">Rank</p>
          <p className="text-sm font-semibold text-text-primary">{rank}</p>
        </div>
      </div>
      <div className="relative h-3 bg-bg-primary rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 rounded-full shimmer" />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-text-muted">{currentXp} XP</span>
        <span className="text-xs text-text-muted">{xpForNext} XP to next level</span>
      </div>
    </div>
  );
}
