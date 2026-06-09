import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function toLocalDateStr(date: Date, tzOffsetMinutes: number): string {
  const local = new Date(date.getTime() + tzOffsetMinutes * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const since = searchParams.get('since');
    const tzOffset = parseInt(searchParams.get('tzOffset') || '0', 10);

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const where: Record<string, unknown> = { userId };
    if (since) {
      const sinceDate = new Date(since);
      if (!isNaN(sinceDate.getTime())) {
        where.createdAt = { gte: sinceDate };
      }
    }

    const logs = await prisma.xpLog.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
    const total = logs.reduce((sum: number, l: { amount: number }) => sum + l.amount, 0);

    const daily = await prisma.xpLog.findMany({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap: Record<string, number> = {};
    daily.forEach((l: { amount: number; createdAt: Date }) => {
      const day = toLocalDateStr(l.createdAt, tzOffset);
      dailyMap[day] = (dailyMap[day] || 0) + l.amount;
    });

    const chartData = Object.entries(dailyMap).map(([date, xp]) => ({ date, xp }));

    return NextResponse.json({ total, logs, chartData });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch XP data' }, { status: 500 });
  }
}