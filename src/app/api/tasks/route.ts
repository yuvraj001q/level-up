import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getXpForDifficulty, getLevelInfo, getNewRank } from '@/lib/game';
import { checkAchievements } from '@/lib/achievements';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const { userId, title, description, difficulty, category, deadline, notes, isAiGenerated } = await req.json();

    if (!userId || !title) {
      return NextResponse.json({ error: 'User ID and title required' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        difficulty: difficulty || 'MEDIUM',
        category,
        deadline: deadline ? new Date(deadline) : null,
        notes,
        isAiGenerated: isAiGenerated || false,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, userId, status, ...data } = await req.json();

    if (!id || !userId) {
      return NextResponse.json({ error: 'Task ID and User ID required' }, { status: 400 });
    }

    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    let xpAwarded = 0;
    let leveledUp = false;
    let newAchievements: string[] = [];

    if (status === 'COMPLETED' && task.status !== 'COMPLETED') {
      xpAwarded = getXpForDifficulty(task.difficulty);

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const newXp = user.xp + xpAwarded;
        const oldLevel = user.level;
        const newLevelInfo = getLevelInfo(newXp);
        const newRank = getNewRank(newLevelInfo.level);

        leveledUp = newLevelInfo.level > oldLevel;

        const completedCount = await prisma.task.count({
          where: { userId, status: 'COMPLETED' },
        });

        const fitnessCount = await prisma.task.count({
          where: { userId, status: 'COMPLETED', category: 'FITNESS' },
        });
        const learningCount = await prisma.task.count({
          where: { userId, status: 'COMPLETED', category: 'LEARNING' },
        });
        const customCount = await prisma.task.count({
          where: { userId, isAiGenerated: false, status: 'COMPLETED' },
        });

        const existingAchievements = await prisma.userAchievement.findMany({
          where: { userId },
          include: { achievement: true },
        });

        const unlockedKeys = existingAchievements.map((a: { achievement: { key: string } }) => a.achievement.key);

        const newlyUnlocked = checkAchievements(unlockedKeys, {
          tasksCompleted: completedCount + 1,
          xp: newXp,
          level: newLevelInfo.level,
          dailyStreak: user.dailyStreak,
          weeklyStreak: user.weeklyStreak,
          longestStreak: user.longestStreak,
          fitnessTasksCompleted: fitnessCount + (task.category === 'FITNESS' ? 1 : 0),
          learningTasksCompleted: learningCount + (task.category === 'LEARNING' ? 1 : 0),
          customTasksCreated: customCount,
          aiQuestsCompleted: 0,
          dailyQuestsCompleted: 0,
        });

        newAchievements = newlyUnlocked.map((a) => a.key);

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
          data: {
            xp: newXp,
            level: newLevelInfo.level,
            rank: newRank,
            dailyStreak: newDailyStreak,
            longestStreak: newLongestStreak,
            lastActiveAt: today,
            achievementPoints: {
              increment: newlyUnlocked.reduce((sum, a) => sum + a.pointsReward, 0),
            },
          },
        });

        if (newAchievements.length > 0) {
          for (const ach of newlyUnlocked) {
            const dbAchievement = await prisma.achievement.findUnique({ where: { key: ach.key } });
            if (dbAchievement) {
              await prisma.userAchievement.create({
                data: { userId, achievementId: dbAchievement.id },
              });
              await prisma.xpLog.create({
                data: {
                  userId,
                  amount: ach.xpReward,
                  reason: `Achievement: ${ach.title}`,
                  source: 'ACHIEVEMENT',
                },
              });
              await prisma.user.update({
                where: { id: userId },
                data: { xp: { increment: ach.xpReward } },
              });
            }
          }
        }

        await prisma.xpLog.create({
          data: {
            userId,
            amount: xpAwarded,
            reason: `Completed task: ${task.title}`,
            source: 'TASK',
          },
        });
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        status: status || task.status,
        completedAt: status === 'COMPLETED' ? new Date() : task.completedAt,
      },
    });

    return NextResponse.json({
      task: updated,
      xpAwarded,
      leveledUp,
      newAchievements,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
