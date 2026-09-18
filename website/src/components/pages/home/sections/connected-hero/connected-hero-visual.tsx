import React from "react";
import { ConnectedAlert } from "./connected-alert";

export function ConnectedHeroVisual() {
  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] xl:min-h-[680px] flex items-center justify-end select-none pointer-events-none">
      {/* Floating Low Stock Alert UI card - anchored next to the physical smartphone */}
      <div className="pointer-events-auto absolute right-2 sm:right-6 lg:right-10 xl:right-16 top-[40%] sm:top-[42%] lg:top-[43%] -translate-y-1/2 z-20 hidden md:block">
        <ConnectedAlert />
      </div>
    </div>
  );
}
