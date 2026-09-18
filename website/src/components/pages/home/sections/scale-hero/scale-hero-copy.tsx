import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScaleHeroProof } from "./scale-hero-proof";

interface ScaleHeroCopyProps {
  config?: {
    eyebrow?: string;
    headline?: string;
    accentText?: string;
    description?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    proofPoints?: Array<{ title: string; subtitle: string }>;
  };
}

export function ScaleHeroCopy({ config }: ScaleHeroCopyProps) {
  const eyebrow = config?.eyebrow || "RETAIL INTELLIGENCE, WITHOUT COMPLEXITY";
  const description =
    config?.description ||
    "Bizonix helps modern retail and wholesale businesses unify inventory, sales, purchasing, accounting and commerce — so you can focus on what's next.";
  const primaryCta = config?.primaryCta || { label: "Book a demo", href: "/contact" };

  return (
    <div className="flex flex-col items-start justify-center max-w-[620px] z-10 py-6 lg:py-10">
      {/* Eyebrow with horizontal line */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] text-slate-600 uppercase select-none">
          {eyebrow}
        </span>
        <div className="w-12 h-px bg-slate-300" aria-hidden="true" />
      </div>

      {/* Main Display Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold tracking-[-0.035em] leading-[0.98] text-slate-900 mb-6 text-left">
        From stores<br />
        to scale<br />
        <span className="text-blue-600 block mt-1">without limits.</span>
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-[540px] mb-8 text-left">
        {description}
      </p>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-12">
        <Link
          href={primaryCta.href}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 group"
        >
          <span>{primaryCta.label}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
        </Link>
      </div>

      {/* Supporting Proof Row */}
      <ScaleHeroProof proofPoints={config?.proofPoints} />
    </div>
  );
}
