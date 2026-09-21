import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleTemplate } from "@/components/pages/modules/module-page/module-template";
import { JsonLd } from "@/components/seo/json-ld";
import {
  moduleRoute,
  moduleSlugs,
} from "@/lib/content/modules/module-pages";
import { assertModulePagesValid } from "@/lib/content/modules/module-pages/validate";
import { getDynamicModule } from "@/lib/content/modules/module-resolver";
import {
  breadcrumbSchema,
  faqSchema,
  softwareApplicationSchema,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site-config";

/**
 * `/modules/[slug]` — the single route behind all module deep pages.
 *
 * Resolution is: slug → `getDynamicModule` → `ModuleTemplate`. An unknown or
 * unpublished slug falls through to the site's own 404.
 */

export function generateStaticParams() {
  assertModulePagesValid();
  return moduleSlugs.map((slug) => ({ slug }));
}

/** Allow dynamic CMS modules to resolve at runtime. */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDynamicModule(slug);
  if (!data) {
    return {
      title: "Module Not Found | Bizonix",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: data.seo.title,
    description: data.seo.description,
    openGraph: {
      title: data.seo.ogTitle || data.seo.title,
      description: data.seo.ogDescription || data.seo.description,
      url: `/modules/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `/modules/${slug}`,
    },
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getDynamicModule(slug);
  if (!data) notFound();

  const path = moduleRoute(data.slug);

  return (
    <>
      <ModuleTemplate data={data} />
      <JsonLd
        schema={[
          breadcrumbSchema(path),
          softwareApplicationSchema({
            name: `${siteConfig.name} ${data.title}`,
            description: data.seo?.description || data.intro,
            path,
            partOf: true,
          }),
          faqSchema(data.faq),
        ]}
      />
    </>
  );
}
