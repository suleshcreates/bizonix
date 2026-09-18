import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact/contact-page";
import { demoFaq } from "@/lib/content/contact/contact-content";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

/* The page is linked internally as `/contact?utm_source=…` from six places.
   The canonical folds all of them onto one indexable URL. */
export const metadata: Metadata = pageMetadata("/contact");

export default function Page() {
  return (
    <>
      <ContactPage />
      {/* The demo FAQ is genuine, visible page content, so it is eligible for
          rich results. */}
      <JsonLd schema={[faqSchema(demoFaq), breadcrumbSchema("/contact")]} />
    </>
  );
}
