const { PrismaClient } = require('../node_modules/@prisma/client');
const p = new PrismaClient();
async function main() {
  const users = await p.user.findMany({ where: { username: 'xyz' }, select: { email: true, username: true, name: true } });
  if (users.length === 0) console.log('No user found with username: xyz');
  else users.forEach(x => console.log('Email:', x.email, '| Name:', x.name));
  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
