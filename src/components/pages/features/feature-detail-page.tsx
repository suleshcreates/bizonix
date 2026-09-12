"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { HowItWorksSection } from "./deep/how-it-works";
import { WhyItMattersSection } from "./deep/why-it-matters";
import { FeatureStorySection } from "./deep/feature-story-section";
import { FeaturesHero } from "./sections/features-hero";

/** What the deep page still needs beyond the two shared sections. */
const detail = {
  barcode: {
    modules: ["inventory", "sales-pos", "wholesale", "franchise"],
  },
  "billing-counters": {
    modules: ["sales-pos", "franchise", "analytics"],
  },
  "gst-compliance": {
    modules: ["accounting", "sales-pos", "wholesale"],
  },
  "series-pricing": {
    modules: ["procurement", "wholesale", "franchise"],
  },
  "stock-transfer": {
    modules: ["inventory", "franchise", "wholesale"],
  },
} as const;

export function FeatureDetailPage({ slug }: { slug: keyof typeof detail }) {
  const data = detail[slug];
  /* A div, not a <main>: the root layout already owns this page's single
     <main id="main"> landmark, and nesting a second one is invalid. */
  return (
    <div className="bg-white text-bz-navy">
      <FeaturesHero initialFeature={slug} />
      <WhyItMattersSection slug={slug} />
      <HowItWorksSection slug={slug} />
      <FeatureStorySection key={slug} feature={slug} />
      <section className="mx-auto w-[min(1120px,calc(100%_-_48px))] border-t border-bz-border py-20">
        <p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-bz-blue">
          Related modules
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {data.modules.map((module) => (
            <Link
              key={module}
              href={`/modules/${module}`}
              className="inline-flex items-center gap-2 rounded-full border border-bz-border px-4 py-3 text-sm font-bold capitalize hover:border-bz-blue hover:bg-bz-blue-soft"
            >
              {module.replace("-", " ")} <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto mb-20 flex w-[min(1120px,calc(100%_-_48px))] items-center justify-between gap-8 rounded-3xl bg-bz-navy p-12 text-white max-lg:flex-col max-lg:items-start">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-bz-teal">
            Ready to see it in context?
          </p>
          <h2 className="mt-3 text-3xl font-black">
            Bring operational detail into one connected workflow.
          </h2>
        </div>
        <Link
          href="/contact"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-bz-blue px-5 text-sm font-bold"
        >
          Book a demo <Check size={17} />
        </Link>
      </section>
    </div>
  );
}
