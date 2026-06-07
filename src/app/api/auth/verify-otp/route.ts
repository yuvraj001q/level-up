import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, phone, otp } = await req.json();

    if (!userId || !phone || !otp) {
      return NextResponse.json({ error: 'User ID, phone, and OTP required' }, { status: 400 });
    }

    const phoneStr = String(phone).replace(/\s/g, '');

    const token = await prisma.otpToken.findFirst({
      where: {
        identifier: phoneStr,
        token: String(otp),
        type: 'PHONE',
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!token) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    await prisma.otpToken.update({
      where: { id: token.id },
      data: { used: true },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { phone: phoneStr, phoneVerified: true },
      select: {
        id: true, name: true, email: true, phone: true, phoneVerified: true,
        age: true, bio: true, goals: true, interests: true,
        level: true, xp: true, rank: true, league: true, achievementPoints: true,
        dailyStreak: true, weeklyStreak: true, longestStreak: true, streakFreeze: true,
      },
    });

    return NextResponse.json({ message: 'Phone verified', user });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
