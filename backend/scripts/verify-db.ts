import { PrismaClient } from '@prisma/client';

async function verify() {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRaw<{ current_database: string, current_user: string }[]>`SELECT current_database(), current_user`;
    console.log(result[0]);
    if (result[0].current_database !== 'bizonix') {
      console.error('WRONG DB: ' + result[0].current_database);
      process.exit(1);
    }
    console.log('DB VERIFIED: bizonix');
    process.exit(0);
  } catch (e) {
    console.error('CONNECTION ERROR:', (e as Error).message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
