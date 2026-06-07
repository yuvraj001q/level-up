'use client';

import { SessionProvider } from 'next-auth/react';
import { ChallengerProvider } from '@/components/providers/ChallengerProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChallengerProvider>
        {children}
      </ChallengerProvider>
    </SessionProvider>
  );
}
