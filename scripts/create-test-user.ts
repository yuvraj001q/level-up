import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('test1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@levelup.game' },
    update: {},
    create: {
      name: 'TestPlayer',
      email: 'test@levelup.game',
      password: hash,
      username: 'testplayer',
      xp: 2500,
      level: 10,
      rank: 'Advanced',
      league: 'IRON',
    },
  });
  console.log('Email: test@levelup.game');
  console.log('Pass:  test1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
