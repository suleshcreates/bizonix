import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IndustryDetailPage } from "@/components/pages/industries/industry-detail-page";
import {
  getIndustryDetail,
  industryDetails,
} from "@/lib/content/industries/industry-detail";

/** Only the industries that actually have detail content are routable. */
export function generateStaticParams() {
  return Object.keys(industryDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getIndustryDetail(slug);
  if (!data) return {};
  return {
    title: data.name,
    description: data.hero.body,
    openGraph: {
      title: data.hero.title,
      description: data.hero.body,
      images: [{ url: data.hero.image }],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getIndustryDetail(slug);
  if (!data) notFound();
  return <IndustryDetailPage data={data} />;
}
