import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
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
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
