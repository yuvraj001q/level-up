import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, phone } = await req.json();

    if (!userId || !phone) {
      return NextResponse.json({ error: 'User ID and phone number required' }, { status: 400 });
    }

    let phoneStr = String(phone).replace(/[\s\-\(\)]/g, '');
    if (phoneStr.startsWith('+')) phoneStr = phoneStr.slice(1);
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

    const apiKey = process.env.FAST2SMS_API_KEY;
    if (apiKey) {
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          numbers: phoneStr,
          variables_values: otp,
        }),
      });
      const data = await res.json();
      if (data.return !== true) {
        console.error('[Fast2SMS Error]', JSON.stringify(data));
      }
    } else {
      console.log(`[OTP] ${phoneStr}: ${otp}`);
    }

    return NextResponse.json({ message: 'OTP sent', debug: process.env.NODE_ENV === 'development' ? otp : undefined });
  } catch (e) {
    console.error('[OTP Error]', e);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
