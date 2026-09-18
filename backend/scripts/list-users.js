const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, displayName: true } });
  console.log('Users in DB:', users);
}

main().finally(() => prisma.$disconnect());
