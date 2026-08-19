import type { Metadata } from "next";
import { FourPillarsRecordSection } from "@/components/sections/four-pillars-record";
import { DayInLife } from "@/components/sections/day-in-life";
import { IntegrationSurface } from "@/components/sections/integration-surface";
import { OperatingModel } from "@/components/sections/operating-model";
import { ProductCTA } from "@/components/sections/product-cta";
import { ProductHero } from "@/components/sections/product-hero";
import { SecurityTenancy } from "@/components/sections/security-tenancy";
import { siteConfig } from "@/lib/site-config";
export const metadata: Metadata = {
  title: "Platform",
  description:
    "See how Bizonix connects warehouse, retail, franchise, ecommerce and finance without mixing operating entities.",
  openGraph: {
    title: "One platform. Every operating entity.",
    description: "The Bizonix operating model for multi-entity retail brands.",
  },
};
const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bizonix ERP",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: siteConfig.description,
};
export default function ProductPage() {
  return (
    <>
      <ProductHero />
      <OperatingModel />
      <FourPillarsRecordSection />
      <DayInLife />
      <SecurityTenancy />
      <IntegrationSurface />
      <ProductCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
