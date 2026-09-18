import React from "react";
import { Package, ChevronRight } from "lucide-react";

export function ConnectedAlert() {
  return (
    <div className="relative inline-flex items-center select-none group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
      {/* Subtle indicator point directed toward the phone */}
      <div 
        className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[7px] border-r-white/95 -mr-[1px] hidden sm:block z-20 drop-shadow-xs" 
        aria-hidden="true" 
      />

      <div className="w-[230px] sm:w-[245px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.35),0_6px_12px_rgba(0,0,0,0.15)] flex items-center justify-between gap-3 transition-all duration-200 group-hover:shadow-[0_20px_40px_-4px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50/90 border border-orange-200/60 flex items-center justify-center text-orange-600 shrink-0 shadow-2xs">
            <Package className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              Low Stock Alert
            </span>
            <span className="text-[10px] sm:text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
              12 items require attention
            </span>
          </div>
        </div>

        <ChevronRight
          className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0"
          strokeWidth={2.2}
        />
      </div>
    </div>
  );
}
