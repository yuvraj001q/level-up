import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const email = 'yuvrajsinghnegi001@gmail.com';
const user = await prisma.user.findUnique({ where: { email } });
if (!user) {
  console.error('User not found');
  process.exit(1);
}
await prisma.user.update({ where: { email }, data: { league: 'BRONZE' } });
console.log(`Demoted ${user.name || email} → BRONZE`);
await prisma.$disconnect();
