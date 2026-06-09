import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, username: true } });
  users.forEach(u => console.log(`${u.email} | ${u.name || ''} | ${u.username || ''}`));
  console.log(`\nTotal: ${users.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
