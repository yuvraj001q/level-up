import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, league } = await req.json();
    if (!email || !league) return NextResponse.json({ error: 'email and league required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await prisma.user.update({ where: { email }, data: { league } });
    return NextResponse.json({ success: true, league });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
