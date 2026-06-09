const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  for (const email of ['demoaccount@test.com', 'demoaccount1234@test.com']) {
    const u = await p.user.findUnique({ where: { email } });
    if (u) {
      await p.user.delete({ where: { email } });
      console.log('Deleted:', email, u.name);
    } else {
      console.log('Not found:', email);
    }
  }
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
