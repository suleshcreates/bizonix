import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryDetailPage } from "@/components/pages/industries/industry-detail-page";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getIndustryDetail,
  industryDetails,
} from "@/lib/content/industries/industry-detail";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/** Only the industries that actually have detail content are routable. */
export function generateStaticParams() {
  return Object.keys(industryDetails).map((slug) => ({ slug }));
}

/** Anything outside that set is a 404, not an on-demand render. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/industries/${slug}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getIndustryDetail(slug);
  if (!data) notFound();

  return (
    <>
      <IndustryDetailPage data={data} />
      <JsonLd schema={breadcrumbSchema(`/industries/${data.slug}`)} />
    </>
  );
}
