'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function XPAnimation() {
  const xpAnimation = useStore((s) => s.xpAnimation);

  return (
    <AnimatePresence>
      {xpAnimation?.show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -60, scale: 1.3 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]"
        >
          <div className="flex items-center gap-2 text-accent-cyan font-bold text-2xl">
            <Zap className="w-6 h-6" />
            +{xpAnimation.amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
