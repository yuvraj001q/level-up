import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ACHIEVEMENTS } from '@/lib/achievements';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });

  const allAchievements = ACHIEVEMENTS.map((a: { key: string; title: string; description: string; icon: string; xpReward: number; pointsReward: number; criteria: Record<string, unknown> }) => {
    const unlocked = userAchievements.find((ua: { achievement: { key: string } }) => ua.achievement.key === a.key);
    return {
      ...a,
      id: a.key,
      unlocked: !!unlocked,
      unlockedAt: (unlocked as { unlockedAt: Date } | undefined)?.unlockedAt || null,
    };
  });

  return NextResponse.json(allAchievements);
}

export async function POST(req: Request) {
  try {
    const { userId, achievementKey } = await req.json();
    if (!userId || !achievementKey) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const achievement = await prisma.achievement.findUnique({
      where: { key: achievementKey },
    });

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    const existing = await prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already unlocked' }, { status: 400 });
    }

    const userAchievement = await prisma.userAchievement.create({
      data: { userId, achievementId: achievement.id },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: achievement.xpReward },
        achievementPoints: { increment: achievement.pointsReward },
      },
    });

    await prisma.xpLog.create({
      data: {
        userId,
        amount: achievement.xpReward,
        reason: `Achievement: ${achievement.title}`,
        source: 'ACHIEVEMENT',
      },
    });

    return NextResponse.json(userAchievement, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
