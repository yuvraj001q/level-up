import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        level: true,
        xp: true,
        rank: true,
        league: true,
        dailyStreak: true,
        achievementPoints: true,
      },
      orderBy: { xp: 'desc' },
      take: 100,
    });

    return NextResponse.json(users);
  } catch {
    try {
      const users = await prisma.$queryRaw<{
        id: string;
        name: string | null;
        level: number;
        xp: number;
        rank: string;
        league: string;
        dailyStreak: number;
        achievementPoints: number;
      }[]>`
        SELECT id, name, level, xp, rank, league, "dailyStreak", "achievementPoints"
        FROM "User"
        ORDER BY xp DESC
        LIMIT 100
      `;
      return NextResponse.json(
        users.map((u) => ({ ...u, username: null, league: u.league as any }))
      );
    } catch {
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
  }
}
