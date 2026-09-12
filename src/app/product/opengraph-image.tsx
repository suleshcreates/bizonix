import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/seo/og-image";
import { getRoute } from "@/lib/seo/routes";

/** This segment's own social card. See lib/seo/og-image.tsx. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Bizonix operating model for multi-entity retail brands";

export default function Image() {
  const route = getRoute("/product");
  return ogImage({
    title: route.ogTitle,
    description: route.ogDescription,
  });
}
