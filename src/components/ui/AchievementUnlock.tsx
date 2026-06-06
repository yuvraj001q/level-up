'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useStore } from '@/store/useStore';

const SPARKLE_COLORS = ['#10b981', '#34d399', '#059669', '#6ee7b7'];

function SparkleBurst() {
  const sparks = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      angle: (i / 16) * Math.PI * 2,
      distance: Math.random() * 60 + 30,
      size: Math.random() * 3 + 1,
      color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    })),
  []);

  return (
    <>
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{ width: s.size, height: s.size, backgroundColor: s.color }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos(s.angle) * s.distance,
            y: Math.sin(s.angle) * s.distance,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

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
          <div className="glass p-4 border-accent-green/30 flex items-center gap-3 relative overflow-visible">
            {/* Sparkle burst around trophy */}
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 3, duration: 0.5 }}
              >
                <Trophy className="w-6 h-6 text-accent-green" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <SparkleBurst />
              </div>
            </div>
            <div>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xs text-accent-green uppercase tracking-wider font-semibold"
              >
                Achievement Unlocked!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm font-medium text-text-primary"
              >
                {achievementAnimation.title}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
