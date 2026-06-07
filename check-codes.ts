import { prisma } from './src/lib/prisma';
const users = await prisma.user.findMany({ select: { email: true, referralCode: true } });
console.log(JSON.stringify(users, null, 2));
await prisma.$disconnect();
