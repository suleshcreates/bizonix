import fs from "fs";
import path from "path";
import { industryDetails } from "../src/lib/content/industries/industry-detail";
import { industryHeroContent } from "../src/lib/content/industries/industry-hero-content";
import { industries } from "../src/lib/content/industries/industries";

const categoryMap: Record<string, string> = {
  "apparel-footwear": "Retail Models",
  "imitation-jewellery": "Retail Models",
  "franchise-networks": "Networks",
};

const accentMap: Record<string, "BLUE" | "TEAL" | "VIOLET"> = {
  "apparel-footwear": "BLUE",
  "imitation-jewellery": "TEAL",
  "franchise-networks": "VIOLET",
};

const badgeMap: Record<string, string> = {
  "apparel-footwear": "Size & Colour Matrix",
  "imitation-jewellery": "Piece Barcodes & Fast POS",
  "franchise-networks": "Entity-Aware Network",
};

const painsIntroMap: Record<string, { eyebrow: string; title: string; lede: string }> = {
  "apparel-footwear": {
    eyebrow: "Where clarity breaks",
    title: "Apparel carries more context than a stock number can hold.",
    lede: "Five pressures show up in almost every apparel operation. None of them are solved by counting harder.",
  },
  "imitation-jewellery": {
    eyebrow: "Where clarity breaks",
    title: "Imitation jewellery demands precision a basic item code cannot provide.",
    lede: "Five operational pressures that make jewellery retail fragile without piece-level control.",
  },
  "franchise-networks": {
    eyebrow: "Where clarity breaks",
    title: "Networks need central discipline without blurring outlet boundaries.",
    lede: "Five tensions between head-office governance and store-level operating autonomy.",
  },
};

const seoMap: Record<string, { metaTitle: string; metaDescription: string; ogTitle: string; ogDescription: string }> = {
  "apparel-footwear": {
    metaTitle: "Apparel & Footwear ERP Software",
    metaDescription: "Connect size, colour and seasonal variant matrices across store, warehouse and partner operations.",
    ogTitle: "Apparel & Footwear Operations — Bizonix",
    ogDescription: "Hold the size and colour grid together across store, warehouse and partner.",
  },
  "imitation-jewellery": {
    metaTitle: "Imitation Jewellery ERP & POS Software",
    metaDescription: "Connect supplier GRNs, piece barcodes and fast counter movement without losing jewellery identity.",
    ogTitle: "Imitation Jewellery Operations — Bizonix",
    ogDescription: "Keep every design, piece and sale in view.",
  },
  "franchise-networks": {
    metaTitle: "ERP for Franchise Retail Networks & Outlets",
    metaDescription: "Give head office visibility to plan and allocate while every outlet keeps responsibility for its own books and stock.",
    ogTitle: "Franchise Networks Operations — Bizonix",
    ogDescription: "Control the network. Keep every entity clear.",
  },
};

const industriesBySlug = new Map(
  industries.map((item) => {
    const slug = item.href.replace("/industries/", "");
    return [slug, item];
  }),
);

const dump = Object.entries(industryDetails).map(([slug, data], index) => {
  if (!data) return null;
  const overviewItem = industriesBySlug.get(slug);
  const hero = industryHeroContent[slug] || null;

  const content = {
    hero,
    painsIntro: painsIntroMap[slug] || {
      eyebrow: "Where clarity breaks",
      title: `${data.name} carries more context than a stock number can hold.`,
      lede: "Operational pressures that require connected enterprise visibility.",
    },
    pains: data.pains,
    fit: data.fit,
    workflow: data.workflow,
    proof: data.proof,
    cta: data.cta,
    matrix: data.matrix || null,
    seo: seoMap[slug] || {
      metaTitle: `${data.name} ERP Software | Bizonix`,
      metaDescription: data.hero.body,
      ogTitle: `${data.name} — Enterprise Solutions`,
      ogDescription: data.hero.title,
    },
  };

  return {
    slug,
    name: data.name,
    category: categoryMap[slug] || "Retail Models",
    summary: overviewItem?.description || data.hero.body,
    accent: accentMap[slug] || "BLUE",
    badge: badgeMap[slug] || "Enterprise Vertical",
    sortOrder: index,
    status: "PUBLISHED",
    everPublished: true,
    showInOverview: true,
    showInMegaMenu: true,
    showInHomepage: true,
    showInFooter: true,
    content,
  };
}).filter(Boolean);

const targetPath = path.resolve(__dirname, "../../backend/scripts/industries-seed-data.json");
fs.writeFileSync(targetPath, JSON.stringify(dump, null, 2), "utf-8");
console.log(`Successfully dumped ${dump.length} canonical industries to ${targetPath}`);
