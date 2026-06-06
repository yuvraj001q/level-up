import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LEAGUE_ORDER, getNextLeague, getPrevLeague } from '@/types';

export async function POST() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      select: { id: true, league: true },
    });

    const updates: { id: string; league: string }[] = [];

    users.forEach((user, index) => {
      const currentLeague = user.league as string;
      const currentIdx = LEAGUE_ORDER.indexOf(currentLeague as typeof LEAGUE_ORDER[number]);

      if (index < 5) {
        // Top 5 — promote
        const next = getNextLeague(currentLeague as typeof LEAGUE_ORDER[number]);
        if (next && next !== currentLeague) {
          updates.push({ id: user.id, league: next });
        }
      } else if (index >= 10) {
        // Rest (below 10) — demote
        const prev = getPrevLeague(currentLeague as typeof LEAGUE_ORDER[number]);
        if (prev && prev !== currentLeague) {
          updates.push({ id: user.id, league: prev });
        }
      }
      // Positions 5-9 stay unchanged
    });

    for (const u of updates) {
      await prisma.user.update({
        where: { id: u.id },
        data: { league: u.league as typeof LEAGUE_ORDER[number], lastPromotion: new Date() },
      });
    }

    return NextResponse.json({ promoted: updates.length });
  } catch {
    return NextResponse.json({ error: 'Failed to promote leagues' }, { status: 500 });
  }
}
