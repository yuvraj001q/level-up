import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.$queryRaw<{ id: string; name: string | null; league: string; xp: number }[]>`
    SELECT id, name, league, xp FROM "User"
    ORDER BY
      CASE league
        WHEN 'CHALLENGER' THEN 0 WHEN 'GRANDMASTER' THEN 1
        WHEN 'MASTER' THEN 2 WHEN 'DIAMOND' THEN 3
        WHEN 'EMERALD' THEN 4 WHEN 'PLATINUM' THEN 5
        WHEN 'GOLD' THEN 6 WHEN 'SILVER' THEN 7
        WHEN 'BRONZE' THEN 8 WHEN 'IRON' THEN 9
      END ASC,
      xp DESC
    LIMIT 100
  `;
  console.log(JSON.stringify(users.map(u => ({ name: u.name, league: u.league, xp: u.xp })), null, 2));
  console.log('\nOrder check:');
  for (const u of users) {
    console.log(`${u.league.padEnd(14)} ${String(u.xp).padStart(8)}  ${u.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
