import type { Metadata } from "next";
import { FourPillarsRecordSection } from "@/components/pages/product/sections/four-pillars-record";
import { DayInLife } from "@/components/pages/product/sections/day-in-life";
import { IntegrationSurface } from "@/components/pages/product/sections/integration-surface";
import { OperatingModel } from "@/components/pages/product/sections/operating-model";
import { ProductHero } from "@/components/pages/product/sections/product-hero";
import { SecurityTenancy } from "@/components/pages/product/sections/security-tenancy";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getRoute } from "@/lib/seo/routes";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata("/product");

export default function ProductPage() {
  return (
    <>
      <ProductHero />
      <OperatingModel />
      <FourPillarsRecordSection />
      <DayInLife />
      <SecurityTenancy />
      <IntegrationSurface />
      <JsonLd
        schema={[
          softwareApplicationSchema({
            name: "Bizonix ERP",
            description: getRoute("/product").description,
            path: "/product",
          }),
          breadcrumbSchema("/product"),
        ]}
      />
    </>
  );
}
