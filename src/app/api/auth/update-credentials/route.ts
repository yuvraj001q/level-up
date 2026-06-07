import { NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, currentPassword, newEmail, newPassword } = await req.json();

    if (!userId || !currentPassword) {
      return NextResponse.json({ error: 'User ID and current password required' }, { status: 400 });
    }

    if (!newEmail && !newPassword) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found or no password set' }, { status: 404 });
    }

    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });
    }

    if (newEmail && newEmail !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: newEmail } });
      if (existing) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    const data: Record<string, unknown> = {};
    if (newEmail) data.email = newEmail;
    if (newPassword) data.password = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({ message: 'Credentials updated', email: newEmail || user.email });
  } catch {
    return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 });
  }
}
