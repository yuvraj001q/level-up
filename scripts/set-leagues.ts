import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Reset all users to IRON
  const reset = await prisma.user.updateMany({ data: { league: 'IRON' } });
  console.log(`Set ${reset.count} users to IRON`);

  // Promote test player to CHALLENGER
  const test = await prisma.user.update({
    where: { email: 'test@levelup.game' },
    data: { league: 'CHALLENGER', hasSeenAscension: false, xp: 100000, level: 100, rank: 'Grandmaster' },
  });
  console.log(`Test player (${test.email}) -> CHALLENGER, XP: ${test.xp}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
