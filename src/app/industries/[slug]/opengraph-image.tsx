import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/seo/og-image";
import { getRoute } from "@/lib/seo/routes";
import { industryDetails } from "@/lib/content/industries/industry-detail";

/** A distinct card per industry page. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Bizonix ERP for your industry";

export function generateStaticParams() {
  return Object.keys(industryDetails).map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getRoute(`/industries/${slug}`);
  return ogImage({
    eyebrow: "Industries",
    title: route.ogTitle,
    description: route.ogDescription,
  });
}
