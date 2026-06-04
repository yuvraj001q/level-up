'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Check if Zustand has cached user data from a previous session
      const isFreshUnAuth = (() => {
        try {
          const raw = localStorage.getItem('level-up-store');
          if (!raw) return true;
          const parsed = JSON.parse(raw);
          if (parsed?.state?.user) return false; // had a session before
          return true;
        } catch {
          return true;
        }
      })();
      if (!isFreshUnAuth) return; // show cached data, don't redirect

      redirectTimer.current = setTimeout(() => {
        router.push('/login');
      }, 1500);
      return () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); };
    }
  }, [status, router]);

  return { session, status, update };
}
