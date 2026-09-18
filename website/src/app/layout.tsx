import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SITE_ORIGIN, seoIdentity } from "@/lib/seo/config";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

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
        {children}
      </body>
    </html>
  );
}
