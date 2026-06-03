import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        goals: [],
        interests: [],
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, ...data } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
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

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
