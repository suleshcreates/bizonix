import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StickyCTA } from "@/components/layout/sticky-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_ORIGIN, seoIdentity } from "@/lib/seo/config";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Site-wide metadata defaults.
 *
 * Only what genuinely belongs to every page lives here. Titles, descriptions,
 * canonicals, robots policies and social cards are built per route by
 * `pageMetadata` — Next replaces nested metadata objects rather than merging
 * them, so a partial default at this level is silently dropped by any page
 * that declares its own.
 *
 * `metadataBase` is what lets relative URLs elsewhere resolve to absolute ones,
 * and the `opengraph-image.tsx` beside this file supplies the default social
 * image for the whole site.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: seoIdentity.defaultTitle,
    template: seoIdentity.titleTemplate,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  publisher: siteConfig.company,
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={jakarta.variable} data-scroll-behavior="smooth">
      <body>
        <a
          className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] bg-white px-4 py-2"
          href="#main"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCTA />
        {/* Publisher and site identity, declared once for the whole site;
            pages add only the schema that describes their own content. */}
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
