import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LEAGUE_ORDER = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'] as const;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
    if (process.env.CRON_SECRET && authHeader !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results: { league: string; promoted: number; demoted: number; stayed: number }[] = [];

    for (let i = LEAGUE_ORDER.length - 1; i >= 0; i--) {
      const league = LEAGUE_ORDER[i];
      const users = await prisma.user.findMany({
        where: { league },
        orderBy: { xp: 'desc' },
        select: { id: true, xp: true },
      });

      if (users.length === 0) continue;

      let promoted = 0;
      let demoted = 0;
      let stayed = 0;

      const updates: { id: string; newLeague: string }[] = [];

      users.forEach((user, idx) => {
        const position = idx + 1;

        if (position <= 5) {
          const nextIdx = i + 1;
          if (nextIdx < LEAGUE_ORDER.length) {
            updates.push({ id: user.id, newLeague: LEAGUE_ORDER[nextIdx] });
            promoted++;
            return;
          }
        }

        if (position > 10) {
          const prevIdx = i - 1;
          if (prevIdx >= 0) {
            updates.push({ id: user.id, newLeague: LEAGUE_ORDER[prevIdx] });
            demoted++;
            return;
          }
        }

        stayed++;
      });

      for (const update of updates) {
        await prisma.user.update({
          where: { id: update.id },
          data: { league: update.newLeague as any, lastPromotion: now },
        });
      }

      results.push({ league, promoted, demoted, stayed });
    }

    return NextResponse.json({ ok: true, processedAt: now.toISOString(), results });
  } catch (error) {
    console.error('Promotion cycle failed:', error);
    return NextResponse.json({ error: 'Promotion cycle failed' }, { status: 500 });
  }
}
