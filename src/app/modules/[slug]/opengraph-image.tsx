import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/seo/og-image";
import { getRoute } from "@/lib/seo/routes";
import { moduleSlugs } from "@/lib/content/modules/module-pages";

/** A distinct card per module, built from that module's own social copy. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Bizonix ERP module";

export function generateStaticParams() {
  return moduleSlugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getRoute(`/modules/${slug}`);
  return ogImage({
    eyebrow: "Solutions",
    title: route.ogTitle,
    description: route.ogDescription,
  });
}
