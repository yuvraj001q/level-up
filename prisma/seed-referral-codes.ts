import { prisma } from '../src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany({ where: { referralCode: '' } });
  console.log(`Found ${users.length} users with empty referral codes`);
  for (const u of users) {
    const base = (u.name || u.email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    const code = base + Math.random().toString(36).slice(2, 6);
    await prisma.user.update({ where: { id: u.id }, data: { referralCode: code } });
    console.log(`Set referralCode "${code}" for ${u.email}`);
  }
  const nullUsers = await prisma.user.findMany({ where: { referralCode: null } });
  if (nullUsers.length > 0) {
    console.log(`Also found ${nullUsers.length} users with null codes`);
    for (const u of nullUsers) {
      const base = (u.name || u.email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
      const code = base + Math.random().toString(36).slice(2, 6);
      await prisma.user.update({ where: { id: u.id }, data: { referralCode: code } });
      console.log(`Set referralCode "${code}" for ${u.email}`);
    }
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
