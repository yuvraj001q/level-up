'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function AchievementUnlock() {
  const achievementAnimation = useStore((s) => s.achievementAnimation);

  return (
    <AnimatePresence>
      {achievementAnimation?.show && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed top-24 right-6 z-[150]"
        >
          <div className="glass p-4 border-accent-green/30 flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 3, duration: 0.5 }}
            >
              <Trophy className="w-6 h-6 text-accent-green" />
            </motion.div>
            <div>
              <p className="text-xs text-accent-green uppercase tracking-wider font-semibold">
                Achievement Unlocked!
              </p>
              <p className="text-sm font-medium text-text-primary">
                {achievementAnimation.title}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
