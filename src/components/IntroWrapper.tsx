'use client';

import { useEffect, useState } from 'react';
import { IntroSequence } from './IntroSequence';

export function IntroWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem('introSeen');
    if (seen) setShowIntro(false);
  }, []);

  if (!mounted) return null;

  if (showIntro) {
    return (
      <IntroSequence
        onComplete={() => {
          sessionStorage.setItem('introSeen', 'true');
          setShowIntro(false);
        }}
      />
    );
  }

  return <>{children}</>;
}
