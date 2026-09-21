const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Industries CMS...');

  const dataPath = path.resolve(__dirname, 'industries-seed-data.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Data file not found at ${dataPath}`);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const industries = JSON.parse(rawData);

  console.log(`Found ${industries.length} canonical industries to seed.`);

  for (const ind of industries) {
    const upserted = await prisma.industryItem.upsert({
      where: { slug: ind.slug },
      update: {
        name: ind.name,
        category: ind.category,
        summary: ind.summary,
        accent: ind.accent,
        badge: ind.badge,
        sortOrder: ind.sortOrder,
        status: ind.status,
        everPublished: ind.everPublished,
        showInOverview: ind.showInOverview,
        showInMegaMenu: ind.showInMegaMenu,
        showInHomepage: ind.showInHomepage,
        showInFooter: ind.showInFooter,
        content: ind.content,
        publishedAt: new Date(),
      },
      create: {
        slug: ind.slug,
        name: ind.name,
        category: ind.category,
        summary: ind.summary,
        accent: ind.accent,
        badge: ind.badge,
        sortOrder: ind.sortOrder,
        status: ind.status,
        everPublished: ind.everPublished,
        showInOverview: ind.showInOverview,
        showInMegaMenu: ind.showInMegaMenu,
        showInHomepage: ind.showInHomepage,
        showInFooter: ind.showInFooter,
        content: ind.content,
        publishedAt: new Date(),
      },
    });

    console.log(`  -> Upserted Industry [${upserted.slug}]: ${upserted.name} (${upserted.status})`);
  }

  console.log('Successfully seeded Industries CMS!');
}

main()
  .catch((e) => {
    console.error('Failed to seed industries CMS:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
