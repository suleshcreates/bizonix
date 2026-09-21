import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryDetailPage } from "@/components/pages/industries/industry-detail-page";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getDynamicIndustry,
  getAllPublicIndustries,
} from "@/lib/content/industries/industry-resolver";
import { industryDetails } from "@/lib/content/industries/industry-detail";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/** Pre-render canonical industries for fast edge delivery */
export async function generateStaticParams() {
  const publicIndustries = await getAllPublicIndustries();
  if (publicIndustries && publicIndustries.length > 0) {
    return publicIndustries.map((ind) => ({ slug: ind.slug }));
  }
  return Object.keys(industryDetails).map((slug) => ({ slug }));
}

/** Allow on-demand server rendering for newly published CMS industries */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDynamicIndustry(slug);

  if (data?.seo?.metaTitle) {
    return {
      title: data.seo.metaTitle,
      description: data.seo.metaDescription,
      openGraph: {
        title: data.seo.ogTitle || data.seo.metaTitle,
        description: data.seo.ogDescription || data.seo.metaDescription,
        images: (data.seo as any)?.ogImage ? [{ url: (data.seo as any).ogImage }] : undefined,
      },
    };
  }

  return pageMetadata(`/industries/${slug}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getDynamicIndustry(slug);
  if (!data) notFound();

  return (
    <>
      <IndustryDetailPage data={data} />
      <JsonLd schema={breadcrumbSchema(`/industries/${data.slug}`)} />
    </>
  );
}
