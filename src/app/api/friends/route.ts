import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  const sent = await prisma.friend.findMany({
    where: { requesterId: userId },
    include: {
      addressee: { select: { id: true, name: true, username: true, image: true, level: true, league: true } },
    },
  });

  const received = await prisma.friend.findMany({
    where: { addresseeId: userId },
    include: {
      requester: { select: { id: true, name: true, username: true, image: true, level: true, league: true } },
    },
  });

  const friends = [
    ...sent.map((f) => ({
      id: f.id,
      requesterId: f.requesterId,
      addresseeId: f.addresseeId,
      status: f.status,
      createdAt: f.createdAt.toISOString(),
      otherUser: f.addressee,
    })),
    ...received.map((f) => ({
      id: f.id,
      requesterId: f.requesterId,
      addresseeId: f.addresseeId,
      status: f.status,
      createdAt: f.createdAt.toISOString(),
      otherUser: f.requester,
    })),
  ];

  return NextResponse.json(friends);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { addresseeId } = await req.json();
  if (!addresseeId) return NextResponse.json({ error: 'addresseeId required' }, { status: 400 });
  if (addresseeId === session.user.id) return NextResponse.json({ error: 'Cannot friend yourself' }, { status: 400 });

  const existing = await prisma.friend.findFirst({
    where: {
      OR: [
        { requesterId: session.user.id, addresseeId },
        { requesterId: addresseeId, addresseeId: session.user.id },
      ],
    },
  });
  if (existing) return NextResponse.json({ error: 'Friend request already exists' }, { status: 409 });

  const friend = await prisma.friend.create({
    data: { requesterId: session.user.id, addresseeId },
    include: {
      addressee: { select: { id: true, name: true, username: true, image: true, level: true, league: true } },
    },
  });

  return NextResponse.json({
    id: friend.id,
    requesterId: friend.requesterId,
    addresseeId: friend.addresseeId,
    status: friend.status,
    createdAt: friend.createdAt.toISOString(),
    otherUser: friend.addressee,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });

  const friend = await prisma.friend.findUnique({ where: { id } });
  if (!friend) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (friend.addresseeId !== session.user.id) return NextResponse.json({ error: 'Not your request' }, { status: 403 });

  const updated = await prisma.friend.update({
    where: { id },
    data: { status },
    include: {
      requester: { select: { id: true, name: true, username: true, image: true, level: true, league: true } },
    },
  });

  return NextResponse.json({
    id: updated.id,
    requesterId: updated.requesterId,
    addresseeId: updated.addresseeId,
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
    otherUser: updated.requester,
  });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const friend = await prisma.friend.findUnique({ where: { id } });
  if (!friend) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (friend.requesterId !== session.user.id && friend.addresseeId !== session.user.id) {
    return NextResponse.json({ error: 'Not your friend' }, { status: 403 });
  }

  await prisma.friend.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
