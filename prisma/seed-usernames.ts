import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateUsername(name: string | null, email: string): string {
  const base = (name || email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 16) || 'user';
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}_${suffix}`;
}

async function main() {
  const users = await prisma.user.findMany({ where: { username: null } });
  console.log(`Found ${users.length} users without username`);

  for (const user of users) {
    let username = user.name
      ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16)
      : user.email.split('@')[0];

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing || !username) {
      username = generateUsername(user.name, user.email);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { username },
    });
    console.log(`Set username "${username}" for ${user.email}`);
  }

  console.log('Done!');
  await prisma.$disconnect();
}

main().catch(console.error);
