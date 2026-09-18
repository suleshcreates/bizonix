import React from "react";

export function ScaleHeroBottomPanel() {
  return (
    <div className="select-none text-left lg:text-right tracking-wider">
      <p className="text-base sm:text-lg lg:text-[22px] xl:text-[24px] font-extrabold tracking-[0.16em] text-white/80 uppercase leading-tight drop-shadow-sm">
        ONE PLATFORM.
      </p>
      <p className="text-base sm:text-lg lg:text-[22px] xl:text-[24px] font-bold tracking-[0.16em] text-white/60 uppercase leading-tight mt-1 drop-shadow-sm">
        MANY POSSIBILITIES.
      </p>
      <div className="w-16 h-[2px] bg-blue-500/70 mt-2.5 lg:ml-auto rounded-full" aria-hidden="true" />
    </div>
  );
}
