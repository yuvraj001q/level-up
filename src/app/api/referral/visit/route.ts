import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

    const user = await prisma.user.findFirst({ where: { referralCode: code } });
    if (!user) return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });

    await prisma.user.update({
      where: { id: user.id },
      data: { referralVisits: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}
