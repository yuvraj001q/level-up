import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

function formatConversation(conv: any) {
  return {
    id: conv.id,
    createdAt: conv.createdAt.toISOString(),
    participants: conv.participants.map((p: any) => p.user),
    lastMessage: conv.messages?.[0]
      ? {
          content: conv.messages[0].content,
          createdAt: conv.messages[0].createdAt.toISOString(),
          senderId: conv.messages[0].senderId,
        }
      : undefined,
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;

    const participations = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { select: { id: true, name: true, image: true } } },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const conversations = participations.map((p) => formatConversation(p.conversation));
    return NextResponse.json(conversations);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let participantIds: unknown;
    try {
      participantIds = (await req.json()).participantIds;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json({ error: 'participantIds must be a non-empty array' }, { status: 400 });
    }

    const allIds = [...new Set([session.user.id, ...participantIds])];

    if (allIds.length === 2) {
      const existing = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: allIds[0] } } },
            { participants: { some: { userId: allIds[1] } } },
          ],
        },
        include: {
          participants: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
      if (existing) {
        return NextResponse.json(formatConversation(existing));
      }
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: allIds.map((uid) => ({ userId: uid })),
        },
      },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
    });

    return NextResponse.json({
      id: conversation.id,
      createdAt: conversation.createdAt.toISOString(),
      participants: conversation.participants.map((p) => p.user),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}