import React from "react";

interface ConnectedHeroShellProps {
  leftContent: React.ReactNode;
  rightVisual: React.ReactNode;
}

export function ConnectedHeroShell({
  leftContent,
  rightVisual,
}: ConnectedHeroShellProps) {
  return (
    <div className="relative w-full bg-[#0A0E17] overflow-hidden flex flex-col min-h-screen justify-between">
      
      {/* Background Layer: Full-Bleed Photorealistic Integrated Retail Scene (Raw photograph, NO darkening overlay) */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/images/hero/connected-retail-hero@2x.jpg" media="(min-width: 1024px)" />
          <img
            src="/images/hero/connected-retail-hero.jpg"
            alt="Modern luxury retail store with connected Bizonix desktop and mobile platforms"
            className="w-full h-full object-cover object-[72%_center] lg:object-center scale-[1.005]"
          />
        </picture>
      </div>

      {/* Main Hero Container: Left Copy (Shifted upside, constrained to left zone) + Right Interactive Zone */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-16 sm:pt-20 lg:pt-20 pb-10 flex-1 flex flex-col lg:flex-row items-start lg:items-start justify-between gap-8 lg:gap-4">
        
        {/* Left Editorial Copy Area (Restricted to left 36% so it never overlaps the monitor) */}
        <div className="w-full lg:w-[38%] xl:w-[35%] shrink-0">
          {leftContent}
        </div>

        {/* Center-Right Interactive Floating Elements Zone */}
        <div className="w-full lg:w-[62%] xl:w-[65%] flex items-center justify-center lg:justify-end">
          {rightVisual}
        </div>

      </div>

    </div>
  );
}
