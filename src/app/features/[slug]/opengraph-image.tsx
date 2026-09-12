import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/seo/og-image";
import { getRoute } from "@/lib/seo/routes";
import { featureSummaries } from "@/lib/content/features/features";

/** A distinct card per feature deep page. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Bizonix ERP capability";

export function generateStaticParams() {
  return featureSummaries.map((feature) => ({ slug: feature.id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getRoute(`/features/${slug}`);
  return ogImage({
    eyebrow: "Features",
    title: route.ogTitle,
    description: route.ogDescription,
  });
}
