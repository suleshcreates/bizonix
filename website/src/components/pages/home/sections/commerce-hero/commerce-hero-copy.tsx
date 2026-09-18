import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Store, RefreshCw, Layers } from "lucide-react";

interface CommerceHeroCopyProps {
  config?: {
    eyebrow?: string;
    headline?: string;
    accentText?: string;
    description?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
}

export function CommerceHeroCopy({ config }: CommerceHeroCopyProps) {
  const eyebrow = config?.eyebrow || "OMNICHANNEL COMMERCE ENGINE";
  const rawHeadline = config?.headline || "Sell everywhere your customers are";
  const accentText = config?.accentText || "seamlessly";
  const description =
    config?.description ||
    "Deliver consistent shopping experiences across physical stores, ecommerce websites, and digital marketplaces with unified live stock truth.";
  const primaryCta = config?.primaryCta || { label: "Explore Modules", href: "/modules" };
  const secondaryCta = config?.secondaryCta || { label: "Contact Sales", href: "/contact" };

  const proofItems = [
    { icon: Store, title: "Omnichannel Sync", subtitle: "POS & Online" },
    { icon: RefreshCw, title: "Zero Overselling", subtitle: "Instant hold" },
    { icon: Layers, title: "Unified Catalog", subtitle: "Single source" },
  ];

  return (
    <div className="flex flex-col items-start justify-start max-w-[500px] xl:max-w-[540px] z-20 select-none">
      {/* Eyebrow with pill badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-[11px] font-semibold tracking-wider text-blue-300 uppercase">
          {eyebrow}
        </span>
      </div>

      {/* Main Display Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-extrabold tracking-tight leading-[1.08] text-white mb-5 text-left">
        {rawHeadline}{" "}
        <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent underline decoration-blue-500/30 decoration-wavy decoration-1">
          {accentText}
        </span>
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-slate-300/90 font-normal leading-relaxed max-w-[460px] mb-7 text-left">
        {description}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
        <Link
          href={primaryCta.href}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{primaryCta.label}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={secondaryCta.href}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-700/60 transition-all hover:border-slate-600"
        >
          <ShoppingBag className="w-4 h-4 text-blue-400" />
          <span>{secondaryCta.label}</span>
        </Link>
      </div>

      {/* Proof Points */}
      <div className="w-full pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3 sm:gap-4">
        {proofItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1 text-blue-400">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {item.title}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 truncate">
                {item.subtitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
