import { PrismaClient } from '@prisma/client';
import { ACHIEVEMENTS } from '../src/lib/achievements';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding achievements...');

  for (const achievement of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        xpReward: achievement.xpReward,
        pointsReward: achievement.pointsReward,
        criteria: achievement.criteria as any,
      },
      create: {
        key: achievement.key,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        xpReward: achievement.xpReward,
        pointsReward: achievement.pointsReward,
        criteria: achievement.criteria as any,
      },
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
