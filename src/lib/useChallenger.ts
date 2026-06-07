'use client';

import { useSession } from 'next-auth/react';

export function useChallenger() {
  const { data: session } = useSession();
  const league = (session?.user as any)?.league;
  return league === 'CHALLENGER';
}
