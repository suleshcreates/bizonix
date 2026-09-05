import { notFound } from "next/navigation";
import { FeatureDetailPage } from "@/components/pages/features/feature-detail-page";

const slugs = [
  "barcode",
  "billing-counters",
  "gst-compliance",
  "series-pricing",
  "stock-transfer",
] as const;
export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug as (typeof slugs)[number])) notFound();
  return <FeatureDetailPage slug={slug as (typeof slugs)[number]} />;
}
