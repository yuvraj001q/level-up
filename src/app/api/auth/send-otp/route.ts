import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, phone } = await req.json();

    if (!userId || !phone) {
      return NextResponse.json({ error: 'User ID and phone number required' }, { status: 400 });
    }

    const phoneStr = String(phone).replace(/\s/g, '');
    if (phoneStr.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { phone: phoneStr } });
    if (existing && existing.id !== userId) {
      return NextResponse.json({ error: 'Phone number already in use' }, { status: 400 });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpToken.create({
      data: { identifier: phoneStr, token: otp, type: 'PHONE', expiresAt },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { phone: phoneStr, phoneVerified: false },
    });

    console.log(`[OTP] ${phoneStr}: ${otp}`);

    return NextResponse.json({ message: 'OTP sent', debug: process.env.NODE_ENV === 'development' ? otp : undefined });
  } catch {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
