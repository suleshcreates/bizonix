import React from "react";
import { ArrowRight } from "lucide-react";

export function ConnectedHeroTrust() {
  return (
    <div className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md relative z-30 select-none">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 lg:gap-14">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/50 shrink-0">
            Trusted by growing brands
          </span>

          <div className="flex flex-wrap items-center gap-8 sm:gap-12 text-white/70">
            {/* ZARA */}
            <span className="font-serif tracking-[0.25em] text-lg sm:text-xl font-black text-white/80">
              ZARA
            </span>

            {/* H&M */}
            <span className="font-sans tracking-tight text-lg sm:text-xl font-black italic text-white/80">
              H&amp;M
            </span>

            {/* adidas */}
            <span className="font-sans tracking-tight text-base sm:text-lg font-extrabold lowercase text-white/80">
              adidas
            </span>

            {/* SHOPPERS STOP */}
            <span className="font-serif tracking-[0.15em] text-xs sm:text-sm font-semibold uppercase text-white/70">
              Shoppers Stop
            </span>

            {/* lifestyle */}
            <span className="font-sans tracking-tight text-base sm:text-lg font-bold lowercase text-white/80">
              lifestyle
            </span>
          </div>
        </div>

        {/* And many more link */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer group">
          <span className="uppercase tracking-widest text-[11px]">And many more</span>
          <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
