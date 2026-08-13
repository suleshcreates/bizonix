import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Terms of use (Draft)",
  description:
    "Draft terms structure for the Bizonix website, pending legal review.",
};
export default function Terms() {
  return (
    <LegalPage
      title="Terms of use"
      sections={[
        {
          heading: "Website use",
          body: "This website provides general information about Bizonix. Final terms will define acceptable use and the status of product information, demonstrations and downloads.",
        },
        {
          heading: "Product information",
          body: "Capabilities shown on the website should be confirmed during a scoped demonstration. Roadmap references and placeholder content do not constitute a binding commitment.",
        },
        {
          heading: "Intellectual property",
          body: "The final terms will describe ownership of the Bizonix name, website content, software, visuals and related Fibonce materials.",
        },
        {
          heading: "Liability",
          body: "Production language limiting warranties and liability must be prepared or reviewed by qualified legal counsel before launch.",
        },
        {
          heading: "Governing law",
          body: "The intended governing law is India. The final jurisdiction, dispute process and company contact details require legal confirmation.",
        },
      ]}
    />
  );
}
