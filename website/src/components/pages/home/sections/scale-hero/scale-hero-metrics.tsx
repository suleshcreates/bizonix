import React from "react";
import { ArrowRight } from "lucide-react";

interface ScaleHeroMetricsProps {
  metrics?: Array<{
    value: string;
    title: string;
    subtitle: string;
  }>;
}

export function ScaleHeroMetrics({ metrics }: ScaleHeroMetricsProps) {
  const defaultMetrics = [
    {
      value: "9+",
      title: "Core Modules",
      subtitle: "Everything your business needs",
    },
    {
      value: "3x",
      title: "Faster Operations",
      subtitle: "Do more with less effort",
    },
    {
      value: "100%",
      title: "Scalable",
      subtitle: "From one store to global teams",
    },
    {
      value: "∞",
      title: "Built for What's Next",
      subtitle: "Retail without limits",
    },
  ];

  const items = metrics && metrics.length === 4 ? metrics : defaultMetrics;

  return (
    <div className="w-full bg-[#081220] border-t border-slate-800/80 text-white select-none relative z-20">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 relative">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col text-left lg:px-8 ${
                idx === 0 ? "lg:pl-0" : ""
              } ${
                idx < items.length - 1 ? "lg:border-r lg:border-slate-800/80" : ""
              }`}
            >
              <div className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white mb-2 leading-none">
                {item.value}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-100 mb-1 tracking-tight">
                {item.title}
              </div>
              <div className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed">
                {item.subtitle}
              </div>
            </div>
          ))}

          {/* Far Right Subtle Arrow & Dot Matrix */}
          <div className="hidden xl:flex items-center gap-6 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
            <ArrowRight className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
            <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-slate-500" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
