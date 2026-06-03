import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAITasks } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { userId, goals, level, interests, streak } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const completedTasks = await prisma.task.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { title: true },
      take: 50,
    });

    const completedTitles = completedTasks.map((t: { title: string }) => t.title);

    const generated = generateAITasks({
      goals: goals || [],
      level: level || 1,
      interests: interests || [],
      streak: streak || 0,
      completedTitles,
    });

    const created = [];
    for (const task of generated) {
      const t = await prisma.task.create({
        data: {
          userId,
          title: task.title,
          description: task.description,
          difficulty: task.difficulty,
          category: task.category,
          isAiGenerated: true,
        },
      });
      created.push(t);
    }

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to generate tasks' }, { status: 500 });
  }
}
