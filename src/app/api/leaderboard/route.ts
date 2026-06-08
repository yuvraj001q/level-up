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
      orderBy: [{ league: 'desc' }, { xp: 'desc' }],
      take: 100,
    });

    return NextResponse.json(users);
  } catch {
    try {
      const users = await prisma.$queryRaw<{
        id: string;
        name: string | null;
        username: string | null;
        level: number;
        xp: number;
        rank: string;
        league: string;
        dailyStreak: number;
        achievementPoints: number;
      }[]>`
        SELECT id, name, username, level, xp, rank, league, "dailyStreak", "achievementPoints"
        FROM "User"
        ORDER BY CASE league
          WHEN 'CHALLENGER' THEN 0 WHEN 'GRANDMASTER' THEN 1
          WHEN 'MASTER' THEN 2 WHEN 'DIAMOND' THEN 3
          WHEN 'EMERALD' THEN 4 WHEN 'PLATINUM' THEN 5
          WHEN 'GOLD' THEN 6 WHEN 'SILVER' THEN 7
          WHEN 'BRONZE' THEN 8 WHEN 'IRON' THEN 9
        END ASC, xp DESC
        LIMIT 100
      `;
      return NextResponse.json(
        users.map((u) => ({ ...u, league: u.league as any }))
      );
    } catch {
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
  }
}
