import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        referralCode: true,
        referralPoints: true,
        referralVisits: true,
        referredBy: { select: { name: true, username: true } },
        _count: { select: { referrals: true } },
      },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.referralCode) {
      const emailPrefix = session.user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'user';
      const code = emailPrefix + Math.random().toString(36).slice(2, 6);
      await prisma.user.update({ where: { id: session.user.id }, data: { referralCode: code } });
      user.referralCode = code;
    }

    return NextResponse.json({
      referralCode: user.referralCode,
      referralPoints: user.referralPoints,
      referredBy: user.referredBy,
      totalReferrals: user._count.referrals,
      totalVisits: user.referralVisits,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch referral data' }, { status: 500 });
  }
}
