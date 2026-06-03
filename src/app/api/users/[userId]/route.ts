import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      age: true,
      bio: true,
      goals: true,
      interests: true,
      productivityLevel: true,
      level: true,
      xp: true,
      rank: true,
      achievementPoints: true,
      dailyStreak: true,
      weeklyStreak: true,
      longestStreak: true,
      lastActiveAt: true,
      streakFreeze: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
