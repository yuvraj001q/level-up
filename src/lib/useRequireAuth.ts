'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export function useRequireAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const reset = useStore((s) => s.reset);

  useEffect(() => {
    if (status === 'unauthenticated') {
      reset();
      router.push('/login');
    }
  }, [status, router, reset]);

  return { session, status, update };
}