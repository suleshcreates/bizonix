const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash('admin_bizonix123');
  await prisma.user.updateMany({
    where: { email: 'admin@bizonix.com' },
    data: { passwordHash: hash }
  });
  console.log('Password for admin@bizonix.com set to admin_bizonix123');
}

main().finally(() => prisma.$disconnect());
