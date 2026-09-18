import React from "react";
import { ShoppingCart, Package, Users, Clock3, ArrowUp } from "lucide-react";

export function ScaleHeroDataCard() {
  const chartBars = [
    { height: "35%", opacity: "0.35" },
    { height: "50%", opacity: "0.45" },
    { height: "65%", opacity: "0.6" },
    { height: "45%", opacity: "0.5" },
    { height: "70%", opacity: "0.7" },
    { height: "85%", opacity: "0.85" },
    { height: "100%", opacity: "1" },
  ];

  const stats = [
    { icon: ShoppingCart, label: "Stores", value: "24" },
    { icon: Package, label: "SKUs", value: "8,420" },
    { icon: Users, label: "Active Customers", value: "3,280" },
    { icon: Clock3, label: "Pending Orders", value: "132" },
  ];

  return (
    <div className="w-[310px] sm:w-[330px] rounded-2xl bg-white border border-slate-100 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] p-5 select-none transition-transform duration-300 hover:scale-[1.01]">
      {/* Total Sales Top Section */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Sales
          </span>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">
            ₹ 12,48,320
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/80 text-[11px] font-semibold">
            <ArrowUp className="w-3 h-3" strokeWidth={2.5} />
            <span>12%</span>
          </div>
        </div>

        {/* Mini Vertical Bar Chart */}
        <div className="flex items-end gap-1.5 h-12 pt-2 px-1">
          {chartBars.map((bar, idx) => (
            <div
              key={idx}
              className="w-2 rounded-t bg-blue-600 transition-all duration-300"
              style={{
                height: bar.height,
                opacity: bar.opacity,
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="w-full h-px bg-slate-100 mb-3.5" aria-hidden="true" />

      {/* Operational Stats Rows */}
      <div className="space-y-2.5">
        {stats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-slate-500 font-medium">
                <IconComp className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.8} />
                <span>{stat.label}</span>
              </div>
              <span className="font-bold text-slate-900 tracking-tight">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
