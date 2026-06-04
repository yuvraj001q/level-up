'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated' && isOnline) {
      // Debounce redirect to let NextAuth session re-fetch when coming back online
      redirectTimer.current = setTimeout(() => {
        router.push('/login');
      }, 1500);
      return () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); };
    }
  }, [status, isOnline, router]);

  return { session, status, isOnline };
}
