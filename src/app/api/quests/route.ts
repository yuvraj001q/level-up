import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateDailyQuests, generateWeeklyQuests, generateMonthlyQuests } from '@/lib/ai';
import { getLevelInfo, getNewRank } from '@/lib/game';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type');

  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  const where: Record<string, unknown> = { userId };
  if (type) where.type = type;

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  where.OR = [
    { status: { not: 'COMPLETED' } },
    { completedAt: { gte: twentyFourHoursAgo } },
  ];

  const quests = await prisma.quest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return NextResponse.json(quests);
}

export async function POST(req: Request) {
  try {
    const { userId, action } = await req.json();

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (action === 'generate_daily') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (user.dailyQuestsGeneratedAt && user.dailyQuestsGeneratedAt >= today) {
        const existing = await prisma.quest.findMany({
          where: { userId, type: 'DAILY', createdAt: { gte: today } },
        });
        return NextResponse.json(existing);
      }

      const goals = (user.goals.length > 0 ? user.goals : ['PRODUCTIVITY']) as any[];
      const dailyTasks = generateDailyQuests(goals, user.level, user.dailyStreak);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const created = [];
      for (const task of dailyTasks) {
        const quest = await prisma.quest.create({
          data: {
            userId,
            title: task.title,
            description: task.description,
            type: 'DAILY',
            difficulty: task.difficulty,
            xpReward: task.difficulty === 'EASY' ? 10 : task.difficulty === 'MEDIUM' ? 25 : task.difficulty === 'HARD' ? 50 : 100,
            category: task.category,
            expiresAt: tomorrow,
            isBonus: task.title.includes('STREAK BONUS'),
            isStreakQuest: task.title.includes('STREAK'),
          },
        });
        created.push(quest);
      }

      await prisma.user.update({
        where: { id: userId },
        data: { dailyQuestsGeneratedAt: new Date() },
      });

      return NextResponse.json(created);
    }

    if (action === 'generate_weekly') {
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      if (user.weeklyQuestsGeneratedAt && user.weeklyQuestsGeneratedAt >= weekStart) {
        const existing = await prisma.quest.findMany({
          where: { userId, type: 'WEEKLY', createdAt: { gte: weekStart } },
        });
        return NextResponse.json(existing);
      }

      const wGoals = (user.goals.length > 0 ? user.goals : ['PRODUCTIVITY']) as any[];
      const weeklyTasks = generateWeeklyQuests(wGoals, user.level);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const created = [];
      for (const task of weeklyTasks) {
        const quest = await prisma.quest.create({
          data: {
            userId,
            title: task.title,
            description: task.description,
            type: 'WEEKLY',
            difficulty: task.difficulty,
            xpReward: task.difficulty === 'MEDIUM' ? 25 : 50,
            category: task.category,
            expiresAt: weekEnd,
          },
        });
        created.push(quest);
      }

      await prisma.user.update({
        where: { id: userId },
        data: { weeklyQuestsGeneratedAt: new Date() },
      });

      return NextResponse.json(created);
    }

    if (action === 'generate_monthly') {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      if (user.monthlyQuestsGeneratedAt && user.monthlyQuestsGeneratedAt >= monthStart) {
        const existing = await prisma.quest.findMany({
          where: { userId, type: 'MONTHLY', createdAt: { gte: monthStart } },
        });
        return NextResponse.json(existing);
      }

      const mGoals = (user.goals.length > 0 ? user.goals : ['PRODUCTIVITY']) as any[];
      const monthlyTasks = generateMonthlyQuests(mGoals, user.level);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const created = [];
      for (const task of monthlyTasks) {
        const quest = await prisma.quest.create({
          data: {
            userId,
            title: task.title,
            description: task.description,
            type: 'MONTHLY',
            difficulty: task.difficulty,
            xpReward: task.difficulty === 'HARD' ? 100 : 250,
            category: task.category,
            expiresAt: monthEnd,
          },
        });
        created.push(quest);
      }

      await prisma.user.update({
        where: { id: userId },
        data: { monthlyQuestsGeneratedAt: new Date() },
      });

      return NextResponse.json(created);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, userId, status } = await req.json();
    if (!id || !userId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const quest = await prisma.quest.findFirst({ where: { id, userId } });
    if (!quest) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let xpAwarded = 0;
    let leveledUp = false;

    if (status === 'COMPLETED' && quest.status !== 'COMPLETED') {
      xpAwarded = quest.xpReward;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const newXp = user.xp + xpAwarded;
        const oldLevel = user.level;
        const newLevelInfo = getLevelInfo(newXp);
        const newRank = getNewRank(newLevelInfo.level);
        leveledUp = newLevelInfo.level > oldLevel;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let newDailyStreak = user.dailyStreak;
        let newLongestStreak = user.longestStreak;

        if (!user.lastActiveAt) {
          newDailyStreak = 1;
        } else {
          const lastActive = new Date(user.lastActiveAt);
          lastActive.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newDailyStreak = user.dailyStreak + 1;
          } else if (diffDays > 1) {
            newDailyStreak = user.dailyStreak > 0 ? 1 : 0;
          }
        }
        newLongestStreak = Math.max(newDailyStreak, user.longestStreak);

        await prisma.user.update({
          where: { id: userId },
          data: { xp: newXp, level: newLevelInfo.level, rank: newRank, dailyStreak: newDailyStreak, longestStreak: newLongestStreak, lastActiveAt: today },
        });

        await prisma.xpLog.create({
          data: {
            userId,
            amount: xpAwarded,
            reason: `Completed quest: ${quest.title}`,
            source: 'QUEST',
          },
        });
      }
    }

    const updated = await prisma.quest.update({
      where: { id },
      data: {
        status: status || quest.status,
        completedAt: status === 'COMPLETED' ? new Date() : quest.completedAt,
      },
    });

    return NextResponse.json({ quest: updated, xpAwarded, leveledUp });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
