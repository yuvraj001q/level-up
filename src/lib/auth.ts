import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password as string, user.password);

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Fetch league on initial sign in
        const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { league: true, hasSeenAscension: true } });
        if (dbUser) {
          token.league = dbUser.league;
          token.hasSeenAscension = dbUser.hasSeenAscension;
        }
      }
      // Refresh league on session update (e.g., after promotion)
      if (trigger === 'update') {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string }, select: { league: true, hasSeenAscension: true } });
        if (dbUser) {
          token.league = dbUser.league;
          token.hasSeenAscension = dbUser.hasSeenAscension;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).league = token.league;
        (session.user as any).hasSeenAscension = token.hasSeenAscension;
      }
      return session;
    },
  },
});
