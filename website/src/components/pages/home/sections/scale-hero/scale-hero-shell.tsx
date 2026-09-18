import React from "react";

interface ScaleHeroShellProps {
  leftContent: React.ReactNode;
  rightVisual: React.ReactNode;
  bottomMetrics: React.ReactNode;
}

export function ScaleHeroShell({
  leftContent,
  rightVisual,
  bottomMetrics,
}: ScaleHeroShellProps) {
  return (
    <div className="relative w-full bg-[#FAFBFD] overflow-hidden flex flex-col">
      {/* Main Top Section (Editorial + Photographic Surface) */}
      <div className="relative w-full min-h-[560px] lg:min-h-[640px] xl:min-h-[680px] flex flex-col lg:flex-row">
        
        {/* Layer 0: Right Photographic Background (Desktop absolute right, Mobile stacked order 2) */}
        <div className="order-2 lg:order-none lg:absolute lg:inset-y-0 lg:right-0 lg:w-[55%] xl:w-[54%] w-full h-[300px] sm:h-[380px] lg:h-full z-0 overflow-hidden">
          <div className="relative w-full h-full">
            <img
              src="/images/hero/scale-retail-bg.jpg"
              alt="Modern premium retail store interior"
              className="w-full h-full object-cover object-center scale-[1.02]"
            />
            {/* Ambient Lighting & Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none" />
          </div>
        </div>

        {/* Layer 1: Left Editorial Surface with Organic Architectural SVG Curve */}
        <div className="order-1 lg:order-none relative z-10 w-full lg:w-[46%] xl:w-[47%] bg-[#FAFBFD] flex items-center pointer-events-auto">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:pl-16 lg:pr-6 xl:pl-20 py-8 lg:py-12">
            {leftContent}
          </div>

          {/* Organic SVG Curved Boundary (Desktop Only) */}
          <div className="hidden lg:block absolute top-0 -right-[119px] h-full w-[120px] pointer-events-none z-10">
            <svg
              viewBox="0 0 120 800"
              preserveAspectRatio="none"
              className="w-full h-full fill-[#FAFBFD]"
              aria-hidden="true"
            >
              <path d="M 0,0 L 20,0 C 45,160 120,320 105,460 C 90,600 35,720 0,800 Z" />
            </svg>
          </div>
        </div>

        {/* Layer 2: Floating UI Overlays & Storefront Details */}
        <div className="order-3 lg:order-none lg:absolute lg:inset-y-0 lg:right-0 lg:w-[55%] xl:w-[54%] w-full h-auto lg:h-full z-20 pointer-events-none">
          {rightVisual}
        </div>

      </div>

      {/* Integrated Bottom Navy Information Strip */}
      <div className="w-full relative z-30">
        {bottomMetrics}
      </div>
    </div>
  );
}
