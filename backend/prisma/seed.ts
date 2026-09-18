import { PrismaClient, HeroStatus, PricingMode } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Roles & Permissions
  const permissions = [
    { key: 'dashboard.read', description: 'Read dashboard metrics' },
    { key: 'enquiries.read', description: 'Read demo requests and contact enquiries' },
    { key: 'enquiries.write', description: 'Manage demo request lifecycle and replies' },
    { key: 'site.read', description: 'Read site settings' },
    { key: 'site.write', description: 'Write site settings' },
    { key: 'hero.read', description: 'Read hero variants' },
    { key: 'hero.write', description: 'Write hero variants' },
    { key: 'hero.preview', description: 'Preview draft heroes' },
    { key: 'hero.publish', description: 'Publish hero variants' },
    { key: 'pricing.read', description: 'Read pricing plans' },
    { key: 'pricing.write', description: 'Write pricing plans' },
    { key: 'navigation.read', description: 'Read navigation' },
    { key: 'navigation.write', description: 'Write navigation' },
    { key: 'modules.read', description: 'Read modules' },
    { key: 'modules.write', description: 'Write modules' },
    { key: 'industries.read', description: 'Read industries' },
    { key: 'industries.write', description: 'Write industries' },
    { key: 'customers.read', description: 'Read customers' },
    { key: 'customers.write', description: 'Write customers' },
    { key: 'partners.read', description: 'Read partners' },
    { key: 'partners.write', description: 'Write partners' },
    { key: 'faqs.read', description: 'Read FAQs' },
    { key: 'faqs.write', description: 'Write FAQs' },
    { key: 'seo.read', description: 'Read SEO settings' },
    { key: 'seo.write', description: 'Write SEO settings' },
    { key: 'audit.read', description: 'Read audit logs' },
    { key: 'users.read', description: 'Read users' },
    { key: 'users.write', description: 'Write users' },
    { key: 'roles.read', description: 'Read roles' },
    { key: 'roles.write', description: 'Write roles' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { description: perm.description },
      create: perm,
    });
  }

  const roles = [
    { name: 'SUPER_ADMIN', description: 'Has all permissions implicitly' },
    { name: 'SITE_ADMIN', description: 'Can manage all content' },
    { name: 'EDITOR', description: 'Can edit content, but not publish hero' },
    { name: 'VIEWER', description: 'Can view content only' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  // Assign base permissions to SITE_ADMIN
  const siteAdminRole = await prisma.role.findUnique({ where: { name: 'SITE_ADMIN' } });
  if (siteAdminRole) {
    const siteAdminPerms = ['dashboard.read', 'enquiries.read', 'enquiries.write'];
    for (const key of siteAdminPerms) {
      const perm = await prisma.permission.findUnique({ where: { key } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: siteAdminRole.id, permissionId: perm.id } },
          update: {},
          create: { roleId: siteAdminRole.id, permissionId: perm.id },
        });
      }
    }
  }

  // 2. Initial Admin
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const passwordHash = await argon2.hash(adminPassword);
      const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });

      if (superAdminRole) {
        await prisma.user.create({
          data: {
            email: adminEmail,
            passwordHash,
            displayName: 'Initial Admin',
            userRoles: {
              create: { roleId: superAdminRole.id },
            },
          },
        });
        console.log(`Created initial admin: ${adminEmail}`);
      }
    } else {
      console.log(`Admin ${adminEmail} already exists`);
    }
  }

  // 3. Hero Variants
  const heroes = [
    {
      key: 'operating',
      name: 'Operating',
      description: 'The operating system for retail',
      status: HeroStatus.PUBLISHED,
      config: {
        eyebrow: 'Bizonix Platform',
        headline: 'The operating system for modern commerce',
        accentText: 'connected',
        description: 'Run your entire retail ecosystem from a single, unified platform designed for growth.',
        primaryCta: { label: 'Contact Sales', href: '/contact' },
        secondaryCta: { label: 'View Platform', href: '/platform' },
        visualVariant: 'dashboard'
      }
    },
    {
      key: 'connected',
      name: 'Connected',
      description: 'Focus on connectivity',
      status: HeroStatus.DRAFT,
      config: {
        eyebrow: 'RETAIL EXCELLENCE, SIMPLIFIED',
        headline: 'More control today. Bigger tomorrow.',
        accentText: 'Bigger',
        description: 'One platform for inventory, sales, purchasing, accounting and commerce. Built to help modern retailers operate smarter and scale faster.',
        primaryCta: { label: 'Book a demo', href: '/contact' },
        secondaryCta: { label: 'Explore the platform', href: '/platform' },
        microCopy: 'No credit card required.',
        visualVariant: 'connected',
        proofPoints: [
          { title: 'All-in-one', subtitle: 'platform' },
          { title: 'Quick to', subtitle: 'implement' },
          { title: 'Built for', subtitle: 'real growth' }
        ]
      }
    },
    {
      key: 'commerce',
      name: 'Commerce',
      description: 'Focus on omnichannel',
      status: HeroStatus.DRAFT,
      config: {
        eyebrow: 'Omnichannel Ready',
        headline: 'Sell everywhere your customers are',
        accentText: 'seamlessly',
        description: 'Deliver consistent experiences across physical stores, ecommerce, and marketplaces.',
        primaryCta: { label: 'Explore Modules', href: '/modules' },
        secondaryCta: { label: 'Contact Sales', href: '/contact' },
        visualVariant: 'storefront'
      }
    },
    {
      key: 'scale',
      name: 'Scale',
      description: 'Focus on enterprise growth',
      status: HeroStatus.DRAFT,
      config: {
        eyebrow: 'RETAIL INTELLIGENCE, WITHOUT COMPLEXITY',
        headline: 'From stores to scale without limits.',
        accentText: 'without limits.',
        description: 'Bizonix helps modern retail and wholesale businesses unify inventory, sales, purchasing, accounting and commerce — so you can focus on what\'s next.',
        primaryCta: { label: 'Book a demo', href: '/contact' },
        secondaryCta: { label: 'Watch video', href: '#video' },
        visualVariant: 'scale',
        proofPoints: [
          { title: 'ALL-IN-ONE', subtitle: 'platform' },
          { title: 'QUICK TO', subtitle: 'implement' },
          { title: 'BUILT FOR', subtitle: 'real growth' }
        ],
        metrics: [
          { value: '9+', title: 'Core Modules', subtitle: 'Everything your business needs' },
          { value: '3x', title: 'Faster Operations', subtitle: 'Do more with less effort' },
          { value: '100%', title: 'Scalable', subtitle: 'From one store to global teams' },
          { value: '∞', title: "Built for What's Next", subtitle: 'Retail without limits' }
        ]
      }
    }
  ];

  for (const hero of heroes) {
    await prisma.homeHeroVariant.upsert({
      where: { key: hero.key },
      update: {
        name: hero.name,
        description: hero.description,
        config: hero.config
      },
      create: hero
    });
  }

  // Publish 'operating' hero
  const operatingHero = await prisma.homeHeroVariant.findUnique({ where: { key: 'operating' } });
  if (operatingHero) {
    await prisma.homeHeroPublishState.upsert({
      where: { id: 'singleton' },
      update: { publishedVariantId: operatingHero.id, publishedAt: new Date() },
      create: { id: 'singleton', publishedVariantId: operatingHero.id, publishedAt: new Date() }
    });
  }

  // 4. Pricing Plans
  const plans = [
    {
      name: 'Starter',
      slug: 'starter',
      description: 'Essential tools for growing retail operations.',
      audience: 'For single stores and small teams',
      pricingMode: PricingMode.CONTACT_SALES,
      sortOrder: 1,
      isFeatured: false
    },
    {
      name: 'Growth',
      slug: 'growth',
      description: 'Advanced operations for multi-channel businesses.',
      audience: 'For multi-store and regional operations',
      pricingMode: PricingMode.CONTACT_SALES,
      sortOrder: 2,
      isFeatured: true
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Custom solutions for complex retail networks.',
      audience: 'For national chains and large franchises',
      pricingMode: PricingMode.CONTACT_SALES,
      sortOrder: 3,
      isFeatured: false
    }
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }

  // 5. Modules
  const modules = [
    { slug: 'inventory', name: 'Inventory Management', sortOrder: 1 },
    { slug: 'procurement', name: 'Procurement', sortOrder: 2 },
    { slug: 'sales-pos', name: 'Sales & POS', sortOrder: 3 },
    { slug: 'wholesale', name: 'Wholesale B2B', sortOrder: 4 },
    { slug: 'franchise', name: 'Franchise Management', sortOrder: 5 },
    { slug: 'accounting', name: 'Accounting Engine', sortOrder: 6 },
    { slug: 'ecommerce', name: 'Ecommerce Sync', sortOrder: 7 },
    { slug: 'analytics', name: 'Analytics & BI', sortOrder: 8 },
    { slug: 'security', name: 'Security & Access', sortOrder: 9 }
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: mod,
      create: mod,
    });
  }

  // 6. Industries
  const industries = [
    { slug: 'apparel-footwear', name: 'Apparel & Footwear', sortOrder: 1 },
    { slug: 'imitation-jewellery', name: 'Imitation Jewellery', sortOrder: 2 },
    { slug: 'franchise-networks', name: 'Franchise Networks', sortOrder: 3 }
  ];

  for (const ind of industries) {
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: ind,
      create: ind,
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
