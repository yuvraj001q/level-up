import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { referralCode: code } });
    if (!user) return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });

    await prisma.referralVisit.create({
      data: {
        referralCode: code,
        visitorIp: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}
