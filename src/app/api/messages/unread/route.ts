import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ count: 0 });

    const conversations = await prisma.conversationParticipant.findMany({
      where: { userId: session.user.id },
      select: { conversationId: true },
    });

    if (conversations.length === 0) return NextResponse.json({ count: 0 });

    const count = await prisma.message.count({
      where: {
        conversationId: { in: conversations.map((c) => c.conversationId) },
        senderId: { not: session.user.id },
        readAt: null,
      },
    });

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
