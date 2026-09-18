import React from "react";
import { Box, Zap, BarChart2 } from "lucide-react";

export function ScaleHeroProof({ proofPoints }: { proofPoints?: Array<{ title: string; subtitle: string }> }) {
  const defaultItems = [
    {
      icon: Box,
      title: "All-in-one",
      subtitle: "platform",
    },
    {
      icon: Zap,
      title: "Quick to",
      subtitle: "implement",
    },
    {
      icon: BarChart2,
      title: "Built for",
      subtitle: "real growth",
    },
  ];

  const items = proofPoints && proofPoints.length === 3
    ? proofPoints.map((p, i) => ({
        icon: defaultItems[i].icon,
        title: p.title,
        subtitle: p.subtitle,
      }))
    : defaultItems;

  return (
    <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2 select-none">
      {items.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
              <IconComponent className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                {item.title}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {item.subtitle}
              </span>
            </div>
            {idx < items.length - 1 && (
              <div className="hidden sm:block w-px h-7 bg-slate-200/70 ml-4" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}
