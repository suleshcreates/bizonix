export const siteConfig = {
  name: "Bizonix",
  tagline: "Business and Operations, Smarter Together",
  company: "Fibonce Tech Solutions Pvt. Ltd.",
  description:
    "An enterprise ERP built for Indian brands running wholesale, retail, and franchise operations together.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://BIZONIX_DOMAIN_TBD.example",
  loginUrl:
    process.env.NEXT_PUBLIC_LOGIN_URL ||
    "https://TENANT_PORTAL_URL_TBD.example",
  brochureUrl: process.env.NEXT_PUBLIC_BROCHURE_URL || "/brochure-coming-soon",
  whatsappUrl:
    process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/WHATSAPP_NUMBER_TBD",
  salesEmail:
    process.env.NEXT_PUBLIC_SALES_EMAIL || "sales@bizonix-placeholder.example",
  salesPhone: process.env.NEXT_PUBLIC_SALES_PHONE || "PHONE_NUMBER_TBD",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
} as const;

const isPublicValue = (value: string) =>
  Boolean(value) && !/(?:_TBD|placeholder|\.example(?:\/|$))/i.test(value);

/** Prevent development placeholders from becoming visible, clickable contact details. */
export const hasSalesEmail = isPublicValue(siteConfig.salesEmail);
export const hasSalesPhone = isPublicValue(siteConfig.salesPhone);
export const hasWhatsApp = isPublicValue(siteConfig.whatsappUrl);

export const primaryNav = [
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/modules", menu: "solutions" },
  { label: "Features", href: "/features", menu: "features" },
  { label: "Industries", href: "/industries", menu: "industries" },
  { label: "About", href: "/about" },
] as const;

export const solutionLinks = [
  { label: "All solutions", href: "/modules" },
  { label: "Inventory", href: "/modules/inventory" },
  { label: "Wholesale", href: "/modules/wholesale" },
  { label: "Franchise", href: "/modules/franchise" },
  { label: "Accounting", href: "/modules/accounting" },
] as const;

export const industryLinks = [
  { label: "All industries", href: "/industries" },
  { label: "Apparel & Footwear", href: "/industries/apparel-footwear" },
  {
    label: "Imitation Jewellery",
    href: "/industries/imitation-jewellery",
  },
  { label: "Franchise Networks", href: "/industries/franchise-networks" },
] as const;

export const featureLinks = [
  { label: "All features", href: "/features" },
  { label: "Barcode", href: "/features/barcode" },
  { label: "Billing Counters", href: "/features/billing-counters" },
  { label: "GST Compliance", href: "/features/gst-compliance" },
  { label: "Series Pricing", href: "/features/series-pricing" },
  { label: "Stock Transfer", href: "/features/stock-transfer" },
] as const;
