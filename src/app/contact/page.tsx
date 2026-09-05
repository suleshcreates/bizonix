import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact/contact-page";
import { demoFaq } from "@/lib/content/contact/contact-content";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "See Bizonix ERP on your wholesale, retail and franchise workflows. Thirty minutes, no preparation needed.",
  openGraph: {
    title: "See Bizonix on your workflows",
    description: "Book a practical workflow demo with the Bizonix team.",
  },
};

/** The demo FAQ is genuine page content, so it is eligible for rich results. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: demoFaq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Page() {
  return (
    <>
      <ContactPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
