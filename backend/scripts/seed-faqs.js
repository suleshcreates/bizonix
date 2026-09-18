const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedFaqs() {
  console.log('Seeding FAQ categories and items...');

  // 1. Categories for HOME
  const homeCategories = [
    { slug: 'operations', name: 'Core Operations', description: 'Inventory, billing, barcoding, and accounting workflows', sortOrder: 1 },
    { slug: 'setup', name: 'Rollout & Tech', description: 'Deployment, hosting, timelines, and technical integration details', sortOrder: 2 },
    { slug: 'governance', name: 'Access & Governance', description: 'Entity scoping, franchise boundaries, and permissions', sortOrder: 3 },
  ];

  const categoryMap = {};
  for (const cat of homeCategories) {
    const record = await prisma.faqCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder, location: 'HOME' },
      create: { slug: cat.slug, name: cat.name, description: cat.description, sortOrder: cat.sortOrder, location: 'HOME' },
    });
    categoryMap[cat.slug] = record.id;
  }
  console.log('Upserted categories:', Object.keys(categoryMap));

  // 2. Home FAQs
  const homeFaqs = [
    {
      question: 'How is Bizonix deployed?',
      answer: 'Bizonix is designed as a central operating platform for warehouse, retail, franchise and ecommerce teams. The exact rollout, migration and hosting approach is scoped during the workflow demo.',
      tag: 'Deployment',
      categorySlug: 'setup',
      sortOrder: 1,
    },
    {
      question: 'Can franchise outlets see only their own operations?',
      answer: 'Yes. Entity-scoped roles are designed to keep each franchise focused on its own stock and workflows while the central team retains consolidated oversight.',
      tag: 'Access Control',
      categorySlug: 'governance',
      sortOrder: 2,
    },
    {
      question: 'Does it support individual-piece barcodes?',
      answer: 'Yes. Bizonix supports piece and series barcode workflows for receiving, label printing, transfers, billing and returns.',
      tag: 'Barcoding',
      categorySlug: 'operations',
      sortOrder: 3,
    },
    {
      question: 'Are accounting and GST workflows included?',
      answer: 'The platform covers tax invoices, chart of accounts, journals, ledgers, receivables, payables and GST-oriented reporting. Your exact compliance workflow should be confirmed during implementation.',
      tag: 'Compliance & Tax',
      categorySlug: 'operations',
      sortOrder: 4,
    },
    {
      question: 'Can it connect ecommerce and store inventory?',
      answer: 'Bizonix includes ecommerce catalog, order and storefront capabilities so commerce can operate against the same product and stock foundation.',
      tag: 'Omnichannel',
      categorySlug: 'operations',
      sortOrder: 5,
    },
    {
      question: 'What support is available during rollout?',
      answer: 'Fibonce works with your team to understand operating entities, masters, permissions and migration needs before defining the rollout and training plan.',
      tag: 'Rollout',
      categorySlug: 'setup',
      sortOrder: 6,
    },
  ];

  for (const item of homeFaqs) {
    const existing = await prisma.faqItem.findFirst({
      where: { question: item.question, location: 'HOME' },
    });

    if (existing) {
      await prisma.faqItem.update({
        where: { id: existing.id },
        data: {
          answer: item.answer,
          tag: item.tag,
          categoryId: categoryMap[item.categorySlug],
          sortOrder: item.sortOrder,
          isPublished: true,
        },
      });
    } else {
      await prisma.faqItem.create({
        data: {
          question: item.question,
          answer: item.answer,
          tag: item.tag,
          categoryId: categoryMap[item.categorySlug],
          sortOrder: item.sortOrder,
          location: 'HOME',
          isPublished: true,
        },
      });
    }
  }
  console.log('Upserted Home FAQs');

  // 3. Book Demo FAQs
  const demoFaqs = [
    {
      question: 'How long is the demo, and do I need to prepare?',
      answer: 'Thirty minutes, and no preparation. It helps if you bring two or three real situations — a transfer that went wrong, a stock count that did not match, a month-end that took too long. We work through those on screen.',
      tag: '30 Mins',
      sortOrder: 1,
    },
    {
      question: 'What if we are not ready to buy?',
      answer: 'That is a normal reason to take the call. A lot of teams use the session to understand what a connected system would change before they budget for one. If it is not the right time, we will say so and leave you with something useful.',
      tag: 'Evaluation',
      sortOrder: 2,
    },
    {
      question: 'Where does our data live, and who can see it?',
      answer: 'Access is scoped per entity, so a franchise outlet sees its own operation and head office sees the network. Data is encrypted in transit. Hosting region, retention and the full security posture are covered in writing during evaluation — ask on the call and we will send the current documentation rather than a marketing summary.',
      tag: 'Security',
      sortOrder: 3,
    },
    {
      question: 'How long does implementation take?',
      answer: 'It depends on how many entities, locations and existing records are involved, and on how clean the opening stock and master data are. We scope it against your actual setup on the call instead of quoting an average that would not apply to you.',
      tag: 'Timeline',
      sortOrder: 4,
    },
    {
      question: 'Will this replace our current systems or work alongside them?',
      answer: 'Both are possible. Most operations keep something in place — a billing tool, an accounting package, a marketplace panel — and use Bizonix as the operating record underneath. Bring your current stack to the call and we will map what moves and what stays.',
      tag: 'Integrations',
      sortOrder: 5,
    },
    {
      question: 'What does it cost?',
      answer: 'Pricing depends on entities, modules and users, so there is no single number that would be honest here. We will walk through the commercial model against your scope on the call, and you will get it in writing afterwards.',
      tag: 'Commercials',
      sortOrder: 6,
    },
    {
      question: 'What happens after go-live?',
      answer: 'The same people who scoped the rollout stay on it. Expect hands-on support through the first close and the first full stock cycle, because that is when the real edge cases surface. We will set out exactly what ongoing support looks like in writing before you commit.',
      tag: 'Ongoing Support',
      sortOrder: 7,
    },
  ];

  for (const item of demoFaqs) {
    const existing = await prisma.faqItem.findFirst({
      where: { question: item.question, location: 'BOOK_DEMO' },
    });

    if (existing) {
      await prisma.faqItem.update({
        where: { id: existing.id },
        data: {
          answer: item.answer,
          tag: item.tag,
          sortOrder: item.sortOrder,
          isPublished: true,
        },
      });
    } else {
      await prisma.faqItem.create({
        data: {
          question: item.question,
          answer: item.answer,
          tag: item.tag,
          sortOrder: item.sortOrder,
          location: 'BOOK_DEMO',
          isPublished: true,
        },
      });
    }
  }
  console.log('Upserted Book Demo FAQs');

  console.log('FAQ seeding completed successfully!');
}

seedFaqs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
