import React from "react";
import { Box, ChevronRight } from "lucide-react";

export function ScaleHeroAlert() {
  return (
    <div className="inline-flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_30px_-8px_rgba(15,23,42,0.14)] select-none transition-all duration-200 hover:shadow-xl hover:translate-y-[-1px] group cursor-pointer">
      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
        <Box className="w-4 h-4" strokeWidth={2.2} />
      </div>

      <div className="flex flex-col text-left pr-2">
        <span className="text-xs font-bold text-slate-900 leading-tight">
          Low Stock Alert
        </span>
        <span className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
          12 items require attention
        </span>
      </div>

      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" strokeWidth={2.2} />
    </div>
  );
}
