'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { AscensionSequence } from '@/components/AscensionSequence';

export function ChallengerProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [showAscension, setShowAscension] = useState(false);
  const prevLeague = useRef<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAscensionComplete = useCallback(() => {
    setShowAscension(false);
  }, []);

  useEffect(() => {
    if (!mounted || status !== 'authenticated' || !session?.user) return;

    const league = (session.user as any).league;
    const hasSeenAscension = (session.user as any).hasSeenAscension;

    if (league === 'CHALLENGER') {
      document.documentElement.classList.add('theme-challenger');

      // Trigger ascension animation on first time
      if (!hasSeenAscension && prevLeague.current !== 'CHALLENGER') {
        setShowAscension(true);
        // Mark as seen
        fetch('/api/users/ascension-seen', { method: 'POST' }).catch(() => {});
      }
    } else {
      document.documentElement.classList.remove('theme-challenger');
    }

    prevLeague.current = league;
  }, [mounted, status, session]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('theme-challenger');
    };
  }, []);

  return (
    <>
      {showAscension && <AscensionSequence onComplete={handleAscensionComplete} />}
      {children}
    </>
  );
}
