import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const since = searchParams.get('since');

  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  const where: Record<string, unknown> = { userId };
  if (since) where.createdAt = { gte: new Date(since) };

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
    const day = l.createdAt.toISOString().slice(0, 10);
    dailyMap[day] = (dailyMap[day] || 0) + l.amount;
  });

  const chartData = Object.entries(dailyMap).map(([date, xp]) => ({ date, xp }));

  return NextResponse.json({ total, logs, chartData });
}
