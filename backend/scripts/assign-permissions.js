const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const siteAdminRole = await prisma.role.findUnique({ where: { name: 'SITE_ADMIN' } });
  if (!siteAdminRole) {
    console.error('SITE_ADMIN role not found');
    return;
  }

  // Permissions needed for employee access to their deals and dashboard
  const permissionKeys = [
    'dashboard.read',
    'enquiries.read',
    'enquiries.write',
  ];

  for (const key of permissionKeys) {
    const perm = await prisma.permission.findUnique({ where: { key } });
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: siteAdminRole.id,
            permissionId: perm.id,
          },
        },
        create: {
          roleId: siteAdminRole.id,
          permissionId: perm.id,
        },
        update: {},
      });
      console.log(`Granted ${key} to SITE_ADMIN`);
    }
  }

  console.log('Finished assigning permissions to SITE_ADMIN');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
