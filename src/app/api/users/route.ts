import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

function generateUsername(name: string | null, email: string): string {
  const base = (name || email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 16) || 'user';
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}_${suffix}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const username = searchParams.get('username');

  if (username) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, name: true, username: true, email: true, image: true, level: true, league: true },
    });
    return NextResponse.json(user || null);
  }

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, username: true, email: true, image: true, level: true, league: true },
    });
    return NextResponse.json(user || null);
  }

  return NextResponse.json({ error: 'email or username required' }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    let username = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16) : email.split('@')[0];
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing || !username) username = generateUsername(name, email);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        goals: [],
        interests: [],
      },
    });

    return NextResponse.json({ id: user.id, email: user.email, username: user.username }, { status: 201 });
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

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
