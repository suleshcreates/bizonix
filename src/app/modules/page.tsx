import type { Metadata } from "next";
import { ModulesIndex } from "@/components/pages/modules/modules-index";
import { moduleIndexItems } from "@/lib/content/modules/modules-index";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Explore Bizonix modules for inventory, procurement, sales, wholesale, franchise, accounting, ecommerce, analytics and security.",
  openGraph: {
    title: "Solutions built for how brands actually operate",
    description: "One ERP across every operating function and entity.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bizonix ERP modules",
  itemListElement: moduleIndexItems.map((module, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: module.title,
    url: `/modules/${module.slug}`,
  })),
};

export default function ModulesPage() {
  return (
    <>
      <ModulesIndex />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
