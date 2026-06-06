'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

function getXpColor(amount: number) {
  if (amount >= 100) return 'text-accent-red';
  if (amount >= 50) return 'text-accent-orange';
  if (amount >= 25) return 'text-accent-purple';
  return 'text-accent-cyan';
}

function getXpGlow(amount: number) {
  if (amount >= 100) return '0 0 30px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.1)';
  if (amount >= 50) return '0 0 30px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.1)';
  if (amount >= 25) return '0 0 30px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)';
  return '0 0 30px rgba(6,182,212,0.3), 0 0 60px rgba(6,182,212,0.1)';
}

export function XPAnimation() {
  const xpAnimation = useStore((s) => s.xpAnimation);

  return (
    <AnimatePresence>
      {xpAnimation?.show && (
        <>
          {/* Echo trails */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`echo-${i}`}
              initial={{ opacity: 0.3, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -40 - i * 20, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[99] ${getXpColor(xpAnimation!.amount)}`}
            >
              <div className="flex items-center gap-2 font-bold text-lg opacity-40">
                <Zap className="w-4 h-4" />
                +{xpAnimation!.amount} XP
              </div>
            </motion.div>
          ))}

          {/* Main XP text */}
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -60, scale: 1.3 }}
            exit={{ opacity: 0, y: -80, scale: 1.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]"
            style={{ filter: `drop-shadow(${getXpGlow(xpAnimation!.amount)})` }}
          >
            <div className={`flex items-center gap-2 font-bold text-2xl ${getXpColor(xpAnimation!.amount)}`}>
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
              +{xpAnimation!.amount} XP
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
