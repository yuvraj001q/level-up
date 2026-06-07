import 'next-auth';
import type { League } from './index';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      league?: League;
      hasSeenAscension?: boolean;
    };
  }

  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    league?: League;
    hasSeenAscension?: boolean;
  }
}
