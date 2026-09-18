import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeatureDetailPage } from "@/components/pages/features/feature-detail-page";
import { JsonLd } from "@/components/seo/json-ld";
import {
  featureSummaries,
  type FeatureId,
} from "@/lib/content/features/features";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/**
 * `/features/[slug]` — the five feature deep pages.
 *
 * These pages previously exported no metadata at all, so all five inherited
 * the root layout's defaults and shipped with the same title and the same
 * description as one another. Each now takes its own entry from the route
 * registry.
 */

const slugs = featureSummaries.map((feature) => feature.id);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

/** Only the five real slugs exist; anything else is a 404. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/features/${slug}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug as FeatureId)) notFound();
  const feature = slug as FeatureId;

  return (
    <>
      <FeatureDetailPage slug={feature} />
      <JsonLd schema={breadcrumbSchema(`/features/${feature}`)} />
    </>
  );
}
