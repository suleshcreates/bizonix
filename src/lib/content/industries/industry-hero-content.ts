import type { HeroIconName } from "@/components/pages/industries/industry-hero-parts/hero-icons";

/**
 * The content contract for the industry hero.
 *
 * One hero component serves every industry deep page. Nothing about a specific
 * industry — no copy, no image path, no icon, no number — lives in the
 * component; it all arrives through `IndustryHeroContent`. Adding a new
 * industry page is a new entry in `industryHeroContent` below and nothing else.
 *
 * Icons are named, not imported. The industry pages render on the server and
 * the hero is a client component; a component reference is a function and
 * cannot cross that boundary. See `hero-icons.ts` — it keeps this whole model
 * plain and serialisable, which is also what a CMS would need one day.
 *
 * Two shapes are deliberately tuples rather than arrays. `trustStats` and
 * `floatingStats` are exactly three long, the layout is built around three, and
 * a tuple makes a fourth entry a type error at author time instead of a broken
 * row in a screenshot.
 */

/* ------------------------------------------------------------------ parts */

/** Accent colours are the page's own tokens. There is no third option. */
export type HeroAccent = "blue" | "teal";

export type HeadlinePart = {
  text: string;
  accent?: HeroAccent;
  /**
   * Ends the current line. The component groups parts into lines on this flag
   * and staggers the entrance line by line, so where the headline breaks is a
   * content decision rather than a width accident.
   */
  breakAfter?: boolean;
};

export type HeroCta = { label: string; href: string };

export type TrustStat = { icon: HeroIconName; label: string; value: string };

export type StatusTone = "positive" | "neutral" | "attention";

export type FloatingDetailCard = {
  icon: HeroIconName;
  title: string;
  meta: string;
  status: { text: string; tone: StatusTone };
};

export type FloatingStatRow = {
  icon: HeroIconName;
  label: string;
  /** The figure the counter runs to. Formatted with `locale` on the way out. */
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: { direction: "up" | "down"; label: string };
};

export type FloatingBanner = {
  icon: HeroIconName;
  title: string;
  subtitle: string;
};

export type TrustLogo = { name: string; tagline?: string };

export type IndustryHeroContent = {
  breadcrumbLabel: string;
  eyebrowLabel: string;
  headlineParts: readonly HeadlinePart[];
  subheadText: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  trustStats: readonly [TrustStat, TrustStat, TrustStat];
  heroImage: { src: string; alt: string };
  floatingCardTopLeft: FloatingDetailCard;
  floatingStatsCardTopRight: readonly [
    FloatingStatRow,
    FloatingStatRow,
    FloatingStatRow,
  ];
  floatingBannerBottomRight: FloatingBanner;
  bgLabel: string;
  /**
   * Both optional, and both required together for anything to render. With no
   * logos the hero drops the entire trust bar — label, row and spacing — rather
   * than showing placeholders. A row of invented customer names is worse than
   * no row at all.
   */
  trustBarLabel?: string;
  trustLogos?: readonly TrustLogo[];
};

/* --------------------------------------------------------------- content */

/**
 * Figures in the floating cards are illustrative operating data, on the same
 * footing as the sample quantities in `VariantMatrix` and the dashboard
 * vignette on the home page: they show the shape of a Bizonix screen, not a
 * customer's results. Where a figure can be derived from something the page
 * below already states — module counts, the variant grid — it is, so the hero
 * can never quote a number the page then contradicts.
 *
 * No trust logos are supplied for any industry. When real, approved customer
 * names exist, add `trustBarLabel` and `trustLogos` to that industry's entry
 * and the bar appears; until then every page correctly renders without one.
 */
export const industryHeroContent: Record<string, IndustryHeroContent> = {
  "imitation-jewellery": {
    breadcrumbLabel: "Imitation Jewellery",
    eyebrowLabel: "Imitation Jewellery",
    headlineParts: [
      { text: "Keep every " },
      { text: "design", accent: "blue" },
      { text: ",", breakAfter: true },
      { text: "piece", accent: "teal" },
      { text: " and sale", breakAfter: true },
      { text: "in view." },
    ],
    subheadText:
      "Connect supplier GRNs, piece barcodes and fast counter movement without losing the identity of the jewellery that moves through the operation.",
    primaryCta: {
      label: "Book a demo",
      href: "/contact?utm_source=imitation-jewellery",
    },
    secondaryCta: { label: "See it on a real style", href: "#variants" },
    trustStats: [
      { icon: "scanBarcode", label: "Tracked at", value: "Piece level" },
      { icon: "store", label: "Across", value: "Counter & store" },
      { icon: "layers", label: "Modules", value: "4 connected" },
    ],
    heroImage: {
      src: "/images/industries/imitation-jewellery/hero.png",
      alt: "Jewellery store team checking pieces and inventory at a display counter.",
    },
    floatingCardTopLeft: {
      icon: "gem",
      title: "Kundan choker set",
      meta: "SKU KJ-4471 · Received on GRN 2208",
      status: { text: "On display", tone: "positive" },
    },
    floatingStatsCardTopRight: [
      {
        icon: "boxes",
        label: "Pieces on hand",
        value: 1284,
        trend: { direction: "up", label: "6%" },
      },
      {
        icon: "receipt",
        label: "Counter sales today",
        value: 96,
        trend: { direction: "up", label: "12%" },
      },
      {
        icon: "packageCheck",
        label: "GRN lines cleared",
        value: 38,
        trend: { direction: "up", label: "4%" },
      },
    ],
    floatingBannerBottomRight: {
      icon: "arrowUpRight",
      title: "Every piece, one identity",
      subtitle: "Receipt to counter, on one record",
    },
    bgLabel: "From supply to showcase",
  },

  "apparel-footwear": {
    breadcrumbLabel: "Apparel & Footwear",
    eyebrowLabel: "Apparel & Footwear",
    headlineParts: [
      { text: "Every " },
      { text: "size", accent: "blue" },
      { text: " and ", breakAfter: false },
      { text: "colour", accent: "teal" },
      { text: ",", breakAfter: true },
      { text: "counted where" },
      { text: "", breakAfter: true },
      { text: "it sits." },
    ],
    subheadText:
      "Hold the size and colour grid together across store, warehouse and partner, so a style reads the same everywhere it is stocked.",
    primaryCta: {
      label: "Book a demo",
      href: "/contact?utm_source=apparel-footwear",
    },
    secondaryCta: { label: "See it on a real style", href: "#variants" },
    trustStats: [
      { icon: "ruler", label: "Tracked at", value: "Size & colour" },
      { icon: "truck", label: "Across", value: "Store, warehouse, partner" },
      { icon: "layers", label: "Modules", value: "5 connected" },
    ],
    heroImage: {
      src: "/images/industries/apparel-footwear/hero.png",
      alt: "Apparel retail team reviewing stock across sizes and colourways.",
    },
    floatingCardTopLeft: {
      icon: "shirt",
      title: "Oxford shirt · Ecru",
      meta: "Style AF-1180 · Sizes S–XXL",
      status: { text: "In stock", tone: "positive" },
    },
    floatingStatsCardTopRight: [
      {
        icon: "boxes",
        label: "Units in the grid",
        value: 2460,
        trend: { direction: "up", label: "8%" },
      },
      {
        icon: "layers",
        label: "Variant cells live",
        value: 48,
        trend: { direction: "up", label: "3%" },
      },
      {
        icon: "wallet",
        label: "Sell-through",
        value: 71,
        suffix: "%",
        trend: { direction: "up", label: "5%" },
      },
    ],
    floatingBannerBottomRight: {
      icon: "arrowUpRight",
      title: "One grid, every location",
      subtitle: "Size and colour never flattened",
    },
    bgLabel: "From grid to shop floor",
  },

  "franchise-networks": {
    breadcrumbLabel: "Franchise Networks",
    eyebrowLabel: "Franchise Networks",
    headlineParts: [
      { text: "Control the " },
      { text: "network", accent: "blue" },
      { text: ".", breakAfter: true },
      { text: "Keep every " },
      { text: "entity", accent: "teal" },
      { text: "", breakAfter: true },
      { text: "clear." },
    ],
    subheadText:
      "Give head office the visibility to plan and allocate while each outlet keeps responsibility for its own operation.",
    primaryCta: {
      label: "Book a demo",
      href: "/contact?utm_source=franchise-networks",
    },
    secondaryCta: { label: "See the allocation view", href: "#variants" },
    trustStats: [
      { icon: "network", label: "Tracked at", value: "Entity level" },
      { icon: "building", label: "Across", value: "Head office & outlets" },
      { icon: "layers", label: "Modules", value: "5 connected" },
    ],
    heroImage: {
      src: "/images/industries/franchise-networks/hero.png",
      alt: "Franchise retail manager reviewing inventory in a contemporary Indian store.",
    },
    floatingCardTopLeft: {
      icon: "store",
      title: "Outlet · West 04",
      meta: "Own books · Own stock position",
      status: { text: "Allocation open", tone: "neutral" },
    },
    floatingStatsCardTopRight: [
      {
        icon: "building",
        label: "Outlets on the network",
        value: 24,
        trend: { direction: "up", label: "2%" },
      },
      {
        icon: "truck",
        label: "Transfers in transit",
        value: 112,
        trend: { direction: "up", label: "9%" },
      },
      {
        icon: "badgeCheck",
        label: "Entities reconciled",
        value: 100,
        suffix: "%",
      },
    ],
    floatingBannerBottomRight: {
      icon: "arrowUpRight",
      title: "One network, distinct books",
      subtitle: "Oversight without merging entities",
    },
    bgLabel: "From head office to outlet",
  },
};
