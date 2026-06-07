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

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
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
        league: true,
        lastPromotion: true,
        achievementPoints: true,
        dailyStreak: true,
        weeklyStreak: true,
        longestStreak: true,
        lastActiveAt: true,
        streakFreeze: true,
        phone: true,
        phoneVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    try {
      const rows = await prisma.$queryRaw<{
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
        age: number | null;
        bio: string | null;
        goals: string[] | null;
        interests: string[] | null;
        "productivityLevel": string | null;
        level: number;
        xp: number;
        rank: string;
        league: string;
        "lastPromotion": Date | null;
        "achievementPoints": number;
        "dailyStreak": number;
        "weeklyStreak": number;
        "longestStreak": number;
        "lastActiveAt": Date | null;
        "streakFreeze": number;
        phone: string | null;
        "phoneVerified": boolean;
      }[]>`
        SELECT id, name, email, image, age, bio, goals, interests,
               "productivityLevel", level, xp, rank, league,
               "lastPromotion", "achievementPoints", "dailyStreak",
               "weeklyStreak", "longestStreak", "lastActiveAt",
               "streakFreeze", phone, "phoneVerified"
        FROM "User"
        WHERE id = ${userId}
        LIMIT 1
      `;

      if (!rows || rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ ...rows[0], username: null, league: rows[0].league as any });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
  }
}
