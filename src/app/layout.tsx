import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StickyCTA } from "@/components/layout/sticky-cta";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Bizonix ERP", template: "%s | Bizonix" },
  description: siteConfig.description,
  icons: { icon: "/brand/icon.svg" },
  openGraph: {
    type: "website",
    siteName: "Bizonix",
    title: "Bizonix ERP",
    description: siteConfig.description,
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.company,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/logo.svg`,
  brand: { "@type": "Brand", name: siteConfig.name },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
