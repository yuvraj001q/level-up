import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
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

  const conversations = participations.map((p) => ({
    id: p.conversation.id,
    createdAt: p.conversation.createdAt.toISOString(),
    participants: p.conversation.participants.map((pp) => pp.user),
    lastMessage: p.conversation.messages[0]
      ? {
          content: p.conversation.messages[0].content,
          createdAt: p.conversation.messages[0].createdAt.toISOString(),
          senderId: p.conversation.messages[0].senderId,
        }
      : undefined,
  }));

  return NextResponse.json(conversations);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { participantIds } = await req.json();
  if (!participantIds?.length) return NextResponse.json({ error: 'participantIds required' }, { status: 400 });

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
      return NextResponse.json({
        id: existing.id,
        createdAt: existing.createdAt.toISOString(),
        participants: existing.participants.map((p) => p.user),
        lastMessage: existing.messages[0]
          ? {
              content: existing.messages[0].content,
              createdAt: existing.messages[0].createdAt.toISOString(),
              senderId: existing.messages[0].senderId,
            }
          : undefined,
      });
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
}
