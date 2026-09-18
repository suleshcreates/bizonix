import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Box, Zap, BarChart2 } from "lucide-react";

interface ConnectedHeroCopyProps {
  config?: {
    eyebrow?: string;
    headline?: string;
    accentText?: string;
    description?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    microCopy?: string;
    proofPoints?: Array<{ title: string; subtitle: string }>;
  };
}

export function ConnectedHeroCopy({ config }: ConnectedHeroCopyProps) {
  const eyebrow = config?.eyebrow || "RETAIL EXCELLENCE, SIMPLIFIED";
  const description =
    config?.description ||
    "One platform for inventory, sales, purchasing, accounting and commerce. Built to help modern retailers operate smarter and scale faster.";
  const primaryCta = config?.primaryCta || { label: "Book a demo", href: "/contact" };
  const secondaryCta = config?.secondaryCta || { label: "Explore the platform", href: "/platform" };
  const microCopy = config?.microCopy || "No credit card required.";

  const proofItems = [
    { icon: Box, title: "All-in-one", subtitle: "platform" },
    { icon: Zap, title: "Quick to", subtitle: "implement" },
    { icon: BarChart2, title: "Built for", subtitle: "real growth" },
  ];

  return (
    <div className="flex flex-col items-start justify-start max-w-[460px] xl:max-w-[480px] z-20 pt-0 sm:pt-2 pb-6 select-none">
      {/* Eyebrow with horizontal line */}
      <div className="flex items-center gap-3 mb-3.5 sm:mb-4">
        <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-sm">
          {eyebrow}
        </span>
        <div className="w-10 h-px bg-white/40" aria-hidden="true" />
      </div>

      {/* Main Display Headline (Shifted upside, compact so it NEVER overlaps the monitor screen) */}
      <h1 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] xl:text-[54px] font-black tracking-[-0.035em] leading-[0.98] text-white mb-4 sm:mb-5 text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
        More control<br />
        today.<br />
        <span className="inline-block whitespace-nowrap">
          <span className="text-blue-500 mr-2">Bigger</span>
          tomorrow.
        </span>
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-[15px] text-white/90 font-normal leading-relaxed max-w-[420px] mb-6 text-left drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        {description}
      </p>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2.5">
        <Link
          href={primaryCta.href}
          className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-blue-600/35 group"
        >
          <span>{primaryCta.label}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
        </Link>

        <Link
          href={secondaryCta.href}
          className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-black/40 hover:bg-white/10 active:bg-white/15 text-white font-semibold text-sm border border-white/30 backdrop-blur-sm transition-all duration-150 group shadow-md"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
          <span>{secondaryCta.label}</span>
        </Link>
      </div>

      {/* Microcopy */}
      <p className="text-xs text-white/60 font-medium mb-6 sm:mb-8 drop-shadow-xs">
        {microCopy}
      </p>

      {/* Proof Row */}
      <div className="flex flex-wrap items-center gap-5 sm:gap-6 pt-1">
        {proofItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 backdrop-blur-xs flex items-center justify-center text-blue-400 shrink-0 shadow-xs">
                <IconComp className="w-3.5 h-3.5" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col text-left leading-tight drop-shadow-xs">
                <span className="text-xs font-bold text-white tracking-tight">
                  {item.title}
                </span>
                <span className="text-[11px] text-white/70 font-medium">
                  {item.subtitle}
                </span>
              </div>
              {idx < proofItems.length - 1 && (
                <div className="hidden sm:block w-px h-5 bg-white/20 ml-2.5" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
