'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

export function AscensionSequence({ onComplete }: Props) {
  const [phase, setPhase] = useState<'black' | 'logo' | 'text' | 'shatter' | 'done'>('black');

  useEffect(() => {
    const t = setTimeout(() => setPhase('logo'), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'logo') {
      const t = setTimeout(() => setPhase('text'), 1200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'text') {
      const t = setTimeout(() => setPhase('shatter'), 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'shatter') {
      const t = setTimeout(() => {
        setPhase('done');
        setTimeout(onComplete, 100);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ backgroundColor: '#000000' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Phase 1: Pure black */}
          {phase === 'black' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              style={{ backgroundColor: '#000000' }}
            />
          )}

          {/* Phase 2: Wolf logo fades in */}
          {phase === 'logo' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  d="M60 10L25 30L15 80L60 110L105 80L95 30Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M35 50L45 35L55 50L60 40L65 50L75 35L85 50"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx="45" cy="65" r="3" fill="#ffffff"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                />
                <motion.circle
                  cx="75" cy="65" r="3" fill="#ffffff"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                />
                {/* Amber eye glow */}
                <motion.circle
                  cx="45" cy="65" r="5" fill="#ffbf00"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.6, scale: 2 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                />
                <motion.circle
                  cx="75" cy="65" r="5" fill="#ffbf00"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.6, scale: 2 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                />
              </svg>
            </motion.div>
          )}

          {/* Phase 3: Text types out */}
          {phase === 'text' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center px-4"
            >
              <motion.p
                className="text-sm tracking-[0.3em] text-white/40 mb-8 font-mono"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                RANK UNLOCKED
              </motion.p>
              <TypewriterText
                text="CHALLENGER"
                className="text-7xl md:text-9xl font-black tracking-tighter text-white"
                delay={0.5}
                onComplete={() => {
                  setTimeout(() => setPhase('shatter'), 600);
                }}
              />
              <motion.p
                className="text-xs tracking-[0.2em] text-white/20 mt-6 font-mono uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                Apex Predator Status Achieved
              </motion.p>
            </motion.div>
          )}

          {/* Phase 4: Shatter/dissolve */}
          {phase === 'shatter' && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: '#000000' }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white"
                  style={{
                    left: `${(i / 30) * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: 0,
                    scale: 0,
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TypewriterText({
  text,
  className,
  delay,
  onComplete,
}: {
  text: string;
  className: string;
  delay: number;
  onComplete: () => void;
}) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onComplete();
      }
    }, 120);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <div className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        className="inline-block w-[3px] h-[0.8em] bg-white ml-1 align-middle"
      />
    </div>
  );
}
