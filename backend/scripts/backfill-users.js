const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Current users:');
  for (const u of users) {
    console.log(`- ${u.email} | username: ${u.username} | role: ${u.role} | welcomeSent: ${u.welcomeEmailSent}`);
  }

  // Update existing users with unique usernames if null
  for (const u of users) {
    if (!u.username) {
      let baseUsername = u.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!baseUsername) baseUsername = 'user';
      // Ensure unique
      let username = baseUsername;
      let counter = 1;
      while (await prisma.user.findFirst({ where: { username, NOT: { id: u.id } } })) {
        username = `${baseUsername}${counter++}`;
      }
      await prisma.user.update({
        where: { id: u.id },
        data: { username }
      });
      console.log(`Updated ${u.email} -> username: ${username}`);
    }
  }

  const updated = await prisma.user.findMany();
  console.log('\nFinal users:');
  for (const u of updated) {
    console.log(`- ${u.email} | username: ${u.username} | role: ${u.role} | welcomeSent: ${u.welcomeEmailSent}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
