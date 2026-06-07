import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    if (!conversationId) return NextResponse.json({ error: 'conversationId required' }, { status: 400 });

    const member = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: session.user.id } },
    });
    if (!member) return NextResponse.json({ error: 'Not a participant' }, { status: 403 });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(
      messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        content: m.content,
        readAt: m.readAt?.toISOString() || null,
        createdAt: m.createdAt.toISOString(),
        sender: m.sender,
      }))
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let conversationId: string, content: string;
    try {
      const body = await req.json();
      conversationId = body.conversationId;
      content = body.content;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    if (!conversationId || !content) return NextResponse.json({ error: 'conversationId and content required' }, { status: 400 });

    const member = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: session.user.id } },
    });
    if (!member) return NextResponse.json({ error: 'Not a participant' }, { status: 403 });

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    try {
      await updateFriendStreak(session.user.id);
    } catch {
      // non-critical
    }

    return NextResponse.json({
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      readAt: null,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

async function updateFriendStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { friendStreak: true, friendInteractionAt: true } });
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastInteraction = user.friendInteractionAt ? new Date(user.friendInteractionAt) : null;
  const lastInteractionDay = lastInteraction ? new Date(lastInteraction).setHours(0, 0, 0, 0) : null;

  if (!lastInteractionDay || lastInteractionDay < today.getTime()) {
    const isConsecutive = lastInteractionDay && (today.getTime() - lastInteractionDay) <= 86400000;
    await prisma.user.update({
      where: { id: userId },
      data: {
        friendStreak: isConsecutive ? user.friendStreak + 1 : 1,
        friendInteractionAt: new Date(),
      },
    });
  }
}