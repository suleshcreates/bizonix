import React from "react";
import { ScaleHeroDataCard } from "./scale-hero-data-card";
import { ScaleHeroAlert } from "./scale-hero-alert";
import { ScaleHeroBottomPanel } from "./scale-hero-bottom-panel";

export function ScaleHeroVisual() {
  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[640px] flex items-center justify-center select-none">
      {/* LEVEL 2: BOLD ENVIRONMENTAL WATERMARK TYPOGRAPHY (Integrated in Physical Architecture) */}
      
      {/* 2A: Main Environmental Brand Headline (Placed in Clear Architectural Space to the Right of Sales Card) */}
      <div className="absolute left-[36%] xl:left-[38%] top-[8%] lg:top-[10%] z-10 pointer-events-none select-none hidden md:block">
        <div className="text-left font-sans font-bold tracking-[0.10em] uppercase leading-[1.08] text-white/35 drop-shadow-sm text-2xl lg:text-[32px] xl:text-[36px]">
          <span className="block text-white/40">SMARTER</span>
          <span className="block text-white/40">RETAIL</span>
          <span className="block text-white/25 mt-1">BRIGHTER</span>
          <span className="block text-white/25">BUSINESS</span>
        </div>
      </div>

      {/* 2B: Architectural Capability Watermark Cluster (Upper Right Wall Area) */}
      <div className="absolute right-[5%] xl:right-[7%] top-[10%] lg:top-[12%] z-10 pointer-events-none select-none hidden lg:block">
        <div className="text-right font-sans font-bold tracking-[0.24em] text-xs lg:text-[14px] xl:text-[15px] text-white/30 space-y-2.5 uppercase drop-shadow-sm">
          <div>INVENTORY</div>
          <div>SALES</div>
          <div>PURCHASING</div>
          <div>ECOMMERCE</div>
          <div>ACCOUNTING</div>
          <div>ANALYTICS</div>
        </div>
      </div>

      {/* LEVEL 3: PRIMARY SALES DATA CARD (Overlapping Curve Boundary on Desktop, Centered on Mobile) */}
      <div className="relative mx-auto my-6 lg:my-0 lg:absolute left-0 lg:left-[-100px] xl:left-[-85px] top-0 lg:top-[18%] xl:top-[20%] z-30 pointer-events-auto flex justify-center w-full lg:w-auto px-4 lg:px-0">
        <ScaleHeroDataCard />
      </div>

      {/* LEVEL 4: SECONDARY LOW STOCK ALERT (Secondary Operational Signal, Clean Separation) */}
      <div className="hidden md:block absolute right-6 lg:right-10 top-[52%] lg:top-[54%] z-30 pointer-events-auto">
        <ScaleHeroAlert />
      </div>

      {/* LEVEL 5: BOTTOM BRAND STATEMENT (Strong Architectural Watermark Signature) */}
      <div className="absolute right-6 sm:right-12 lg:right-16 bottom-6 sm:bottom-10 z-20 pointer-events-none">
        <ScaleHeroBottomPanel />
      </div>
    </div>
  );
}
