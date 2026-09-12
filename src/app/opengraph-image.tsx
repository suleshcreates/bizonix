import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/seo/og-image";
import { getRoute } from "@/lib/seo/routes";

/**
 * The site's default social card, inherited by every route that does not
 * generate its own. Next emits `og:image` and `twitter:image` from this file,
 * which is why no page needs to name an image path by hand.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Bizonix ERP — wholesale, retail and franchise on one operating record";

export default function Image() {
  const home = getRoute("/");
  return ogImage({ title: home.ogTitle, description: home.ogDescription });
}
