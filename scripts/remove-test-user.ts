import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.delete({ where: { email: 'test@levelup.game' } });
  console.log(`Deleted test user: ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
