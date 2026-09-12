import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleTemplate } from "@/components/pages/modules/module-page/module-template";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getModulePage,
  moduleRoute,
  moduleSlugs,
} from "@/lib/content/modules/module-pages";
import { assertModulePagesValid } from "@/lib/content/modules/module-pages/validate";
import { pageMetadata } from "@/lib/seo/metadata";
import { getRoute } from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  faqSchema,
  softwareApplicationSchema,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site-config";

/**
 * `/modules/[slug]` — the single route behind all nine module deep pages.
 *
 * Resolution is: slug → `getModulePage` → `ModuleTemplate`. An unknown slug
 * falls through to the site's own 404 rather than defaulting to a module, so a
 * typo can never silently render Inventory.
 */

export function generateStaticParams() {
  /* Data validation runs here so a malformed module fails the build rather
     than shipping a broken page: duplicate slugs, missing hero fields, invalid
     related links, malformed screenshots and duplicated metadata all throw.
     Outstanding production assets are reported as warnings in development. */
  assertModulePagesValid();
  return moduleSlugs.map((slug) => ({ slug }));
}

/** Only the nine canonical slugs exist; anything else is a 404. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(moduleRoute(slug as (typeof moduleSlugs)[number]));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getModulePage(slug);
  if (!data) notFound();

  const path = moduleRoute(data.slug);

  return (
    <>
      <ModuleTemplate data={data} />
      <JsonLd
        schema={[
          /* Built from the same trail the template renders, so the visible
             breadcrumb and the structured data cannot disagree. */
          breadcrumbSchema(path),
          /* Deliberately minimal: the module is described, and nothing is
             asserted about ratings, pricing or availability that the site
             cannot support. */
          softwareApplicationSchema({
            name: `${siteConfig.name} ${data.title}`,
            description: getRoute(path).description,
            path,
            partOf: true,
          }),
          faqSchema(data.faq),
        ]}
      />
    </>
  );
}
