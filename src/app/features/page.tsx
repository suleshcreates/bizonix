import type { Metadata } from "next";
import { FeaturesIndex } from "@/components/pages/features/features-index";
import { featureSummaries } from "@/lib/content/features/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "The five cross-cutting details behind Bizonix ERP: piece barcodes, billing counter sessions, GST capture, series pricing and stock transfer visibility.",
  openGraph: {
    title: "The small things that make the big numbers true",
    description:
      "Piece identity, counter control, tax truth, price discipline and movement visibility — the capabilities that run underneath every Bizonix module.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bizonix ERP features",
  itemListElement: featureSummaries.map((feature, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${feature.title} — ${feature.discipline}`,
    url: `/features#${feature.id}`,
  })),
};

export default function FeaturesPage() {
  return (
    <>
      <FeaturesIndex />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
