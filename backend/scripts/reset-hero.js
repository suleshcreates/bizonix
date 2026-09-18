const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const operating = await prisma.homeHeroVariant.findUnique({ where: { key: 'operating' } });
  const scale = await prisma.homeHeroVariant.findUnique({ where: { key: 'scale' } });

  if (scale) {
    await prisma.homeHeroVariant.update({
      where: { id: scale.id },
      data: { status: 'DRAFT' }
    });
  }

  if (operating) {
    await prisma.homeHeroVariant.update({
      where: { id: operating.id },
      data: { status: 'PUBLISHED' }
    });

    await prisma.homeHeroPublishState.upsert({
      where: { id: 'singleton' },
      update: { publishedVariantId: operating.id },
      create: { id: 'singleton', publishedVariantId: operating.id }
    });
  }

  console.log('Successfully set Operating as PUBLISHED and Scale as DRAFT!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
