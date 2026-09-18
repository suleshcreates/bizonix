import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StickyCTA } from "@/components/layout/sticky-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
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
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
    </>
  );
}
