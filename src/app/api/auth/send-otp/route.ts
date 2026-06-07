import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import twilio from 'twilio';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

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

    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      await twilioClient.messages.create({
        body: `Your Level Up verification code is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneStr,
      });
    } else {
      console.log(`[OTP] ${phoneStr}: ${otp}`);
    }

    return NextResponse.json({ message: 'OTP sent', debug: process.env.NODE_ENV === 'development' ? otp : undefined });
  } catch (e) {
    console.error('[OTP Error]', e);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
