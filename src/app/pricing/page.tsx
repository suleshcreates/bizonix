import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { PricingPage } from "@/components/pages/pricing/pricing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { pricingFaq } from "@/lib/content/pricing/pricing";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata("/pricing");

export default function Page() {
  // Keep the implementation available for a future pricing launch.
  if (!siteConfig.pricingEnabled) notFound();

  return (
    <>
      <PricingPage />
      {/* The FAQ is genuine, visible page content, so it is eligible for rich
          results. No Offer or PriceSpecification schema: the page publishes
          placeholder tokens rather than figures, and marking up a price that
          does not exist is exactly the fabrication the schema rules forbid. */}
      <JsonLd schema={[faqSchema(pricingFaq), breadcrumbSchema("/pricing")]} />
    </>
  );
}
