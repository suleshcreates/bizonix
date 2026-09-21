const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Modules & Solutions CMS...');

  const dataPath = path.resolve(__dirname, 'modules-seed-data.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Data file not found at ${dataPath}`);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const modules = JSON.parse(rawData);

  console.log(`Found ${modules.length} canonical modules to seed.`);

  for (const m of modules) {
    const { faqs, ...moduleFields } = m;

    const upserted = await prisma.moduleItem.upsert({
      where: { slug: moduleFields.slug },
      update: {
        title: moduleFields.title,
        category: moduleFields.category,
        summary: moduleFields.summary,
        outcome: moduleFields.outcome,
        themeKey: moduleFields.themeKey,
        iconKey: moduleFields.iconKey,
        badge: moduleFields.badge,
        sortOrder: moduleFields.sortOrder,
        status: moduleFields.status,
        everPublished: moduleFields.everPublished,
        showInCatalog: moduleFields.showInCatalog,
        showInMegaMenu: moduleFields.showInMegaMenu,
        showInHomepage: moduleFields.showInHomepage,
        showInFooter: moduleFields.showInFooter,
        content: moduleFields.content,
        publishedAt: new Date(),
      },
      create: {
        slug: moduleFields.slug,
        title: moduleFields.title,
        category: moduleFields.category,
        summary: moduleFields.summary,
        outcome: moduleFields.outcome,
        themeKey: moduleFields.themeKey,
        iconKey: moduleFields.iconKey,
        badge: moduleFields.badge,
        sortOrder: moduleFields.sortOrder,
        status: moduleFields.status,
        everPublished: moduleFields.everPublished,
        showInCatalog: moduleFields.showInCatalog,
        showInMegaMenu: moduleFields.showInMegaMenu,
        showInHomepage: moduleFields.showInHomepage,
        showInFooter: moduleFields.showInFooter,
        content: moduleFields.content,
        publishedAt: new Date(),
      },
    });

    console.log(`✓ Module seeded: ${upserted.title} (${upserted.slug})`);

    // Clean out old module faqs for this module to guarantee idempotent sync
    await prisma.faqItem.deleteMany({
      where: {
        location: 'MODULE',
        moduleId: upserted.id,
      },
    });

    // Seed module-specific FAQs
    if (faqs && faqs.length > 0) {
      for (const f of faqs) {
        await prisma.faqItem.create({
          data: {
            question: f.question,
            answer: f.answer,
            location: 'MODULE',
            moduleId: upserted.id,
            sortOrder: f.sortOrder,
            isPublished: f.isPublished,
          },
        });
      }
      console.log(`  ↳ Seeded ${faqs.length} FAQs for ${upserted.slug}`);
    }
  }

  // Ensure permissions exist in database
  const permissions = [
    { key: 'modules.read', description: 'Read module list and deep pages' },
    { key: 'modules.write', description: 'Create and edit module drafts' },
    { key: 'modules.publish', description: 'Publish and unpublish modules' },
    { key: 'modules.archive', description: 'Archive and restore modules' },
    { key: 'modules.reorder', description: 'Reorder modules' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { description: perm.description },
      create: perm,
    });
  }
  console.log('✓ Modules permissions upserted.');

  const count = await prisma.moduleItem.count();
  const faqCount = await prisma.faqItem.count({ where: { location: 'MODULE' } });
  console.log(`Done! Total ModuleItem records in DB: ${count}, Total Module FAQs: ${faqCount}`);
}

main()
  .catch((e) => {
    console.error('Error seeding modules:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
