import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StickyCTA } from "@/components/layout/sticky-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { getPublicNavigation } from "@/lib/content/navigation/navigation-resolver";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const navData = await getPublicNavigation();

  return (
    <>
      <a
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] bg-white px-4 py-2"
        href="#main"
      >
        Skip to content
      </a>
      <Header
        announcement={navData.announcement}
        headerConfig={navData.header}
        megaMenus={navData.megaMenus}
      />
      <main id="main">{children}</main>
      <Footer
        footerColumns={navData.footerColumns}
        footerCta={navData.footerCta}
        bottomBar={navData.bottomBar}
      />
      <StickyCTA />
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
    </>
  );
}
