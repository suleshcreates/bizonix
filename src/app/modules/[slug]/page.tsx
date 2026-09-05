import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleTemplate } from "@/components/pages/modules/module-page/module-template";
import {
  getModulePage,
  moduleRoute,
  moduleSlugs,
} from "@/lib/content/modules/module-pages";
import { assertModulePagesValid } from "@/lib/content/modules/module-pages/validate";
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
  const data = getModulePage(slug);
  if (!data) return {};

  const canonical = moduleRoute(data.slug);

  return {
    title: data.seo.title,
    description: data.seo.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: data.seo.ogTitle,
      description: data.seo.ogDescription,
      ...(data.seo.ogImage ? { images: [{ url: data.seo.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: data.seo.ogTitle,
      description: data.seo.ogDescription,
    },
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getModulePage(slug);
  if (!data) notFound();

  const url = `${siteConfig.url}${moduleRoute(data.slug)}`;

  /* Breadcrumb schema is generated from the same trail the template renders,
     so the markup and the structured data cannot disagree. */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", item: siteConfig.url },
      { name: "Solutions", item: `${siteConfig.url}/modules` },
      { name: data.title, item: url },
    ].map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };

  /* Deliberately minimal: the module is described, and nothing is asserted
     about ratings, pricing or availability that the site cannot support. */
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${siteConfig.name} ${data.title}`,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Enterprise Resource Planning",
    operatingSystem: "Web",
    url,
    description: data.seo.description,
    isPartOf: {
      "@type": "SoftwareApplication",
      name: `${siteConfig.name} ERP`,
      url: siteConfig.url,
    },
    publisher: { "@type": "Organization", name: siteConfig.company },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <ModuleTemplate data={data} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema,
            applicationSchema,
            faqSchema,
          ]),
        }}
      />
    </>
  );
}
