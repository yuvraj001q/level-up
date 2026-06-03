'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  dailyStreak: number;
  longestStreak: number;
}

export function StreakCounter({ dailyStreak, longestStreak }: StreakCounterProps) {
  return (
    <div className="glass p-4">
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative"
        >
          <Flame className={`w-8 h-8 ${dailyStreak > 0 ? 'text-accent-orange' : 'text-text-muted'}`} />
          {dailyStreak > 0 && (
            <motion.div
              className="absolute inset-0 w-8 h-8 rounded-full bg-accent-orange/20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.div>
        <div>
          <p className="text-2xl font-bold">{dailyStreak} <span className="text-sm font-normal text-text-muted">day streak</span></p>
          <p className="text-xs text-text-muted">Best: {longestStreak} days</p>
        </div>
      </div>
    </div>
  );
}
