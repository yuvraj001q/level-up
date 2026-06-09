const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany({ select: { id: true, email: true, name: true, username: true } })
  .then(u => { u.forEach(x => console.log(x.email, '|', x.name || '', '|', x.username || '')); console.log('\nTotal:', u.length); p.$disconnect(); })
  .catch(e => { console.error(e); p.$disconnect(); });
