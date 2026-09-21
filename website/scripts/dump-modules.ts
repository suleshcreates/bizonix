import fs from "fs";
import path from "path";
import { modulePages } from "../src/lib/content/modules/module-pages";
import { moduleIndexItems } from "../src/lib/content/modules/modules-index";

const categoryMap: Record<string, string> = {
  inventory: "Core Operations",
  procurement: "Supply & Purchasing",
  "sales-pos": "Commerce",
  wholesale: "Commerce",
  franchise: "Core Operations",
  accounting: "Finance",
  ecommerce: "Commerce",
  analytics: "Intelligence & Security",
  security: "Intelligence & Security",
};

const themeKeyMap: Record<string, string> = {
  inventory: "CYAN",
  procurement: "ORANGE",
  "sales-pos": "CORAL",
  wholesale: "EMERALD",
  franchise: "BLUE",
  accounting: "PURPLE",
  ecommerce: "PINK",
  analytics: "INDIGO",
  security: "SLATE",
};

const iconKeyMap: Record<string, string> = {
  inventory: "BOXES",
  procurement: "TRUCK",
  "sales-pos": "SCAN_BARCODE",
  wholesale: "BUILDING",
  franchise: "STORE",
  accounting: "CALCULATOR",
  ecommerce: "SHOPPING_BAG",
  analytics: "BAR_CHART",
  security: "SHIELD_CHECK",
};

const indexItemBySlug = new Map(moduleIndexItems.map((item) => [item.slug, item]));

const dump = Object.entries(modulePages).map(([slug, data], index) => {
  const indexItem = indexItemBySlug.get(slug);

  // Clean Lucide React components out of serializable JSON
  const content = {
    hero: {
      eyebrow: data.hero.eyebrow,
      headline: data.hero.headline,
      headlineAccent: data.hero.headlineAccent,
      body: data.hero.body,
      primaryCta: data.hero.primaryCta,
      secondaryCta: data.hero.secondaryCta,
      templateKey: data.hero.visualVariant || "standard",
      chain: data.hero.chain,
      screen: data.hero.screen,
      facts: data.hero.facts,
    },
    problemSection: data.problemSection,
    outcomesSection: data.outcomesSection,
    capabilities: data.capabilities,
    workflow: data.workflow,
    gallery: data.gallery,
    verticalRelevance: data.verticalRelevance,
    proof: data.proof || null,
    video: data.video || null,
    relatedModules: data.relatedModules,
    seo: data.seo,
  };

  return {
    slug,
    title: data.title,
    category: categoryMap[slug] || "Core Operations",
    summary: indexItem?.summary || data.intro,
    outcome: indexItem?.outcome || data.outcome,
    themeKey: themeKeyMap[slug] || "BLUE",
    iconKey: iconKeyMap[slug] || "BOXES",
    badge: null,
    sortOrder: index + 1,
    status: "PUBLISHED",
    everPublished: true,
    showInCatalog: true,
    showInMegaMenu: true,
    showInHomepage: true,
    showInFooter: false,
    content,
    faqs: data.faq.map((f, fIdx) => ({
      question: f.question,
      answer: f.answer,
      sortOrder: fIdx + 1,
      isPublished: true,
    })),
  };
});

const outputPath = path.resolve(__dirname, "../../backend/scripts/modules-seed-data.json");
fs.writeFileSync(outputPath, JSON.stringify(dump, null, 2), "utf-8");
console.log(`Successfully extracted ${dump.length} canonical modules to ${outputPath}`);
