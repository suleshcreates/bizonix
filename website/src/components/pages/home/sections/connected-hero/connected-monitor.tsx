import React from "react";
import {
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  BookOpen,
  Users,
  BarChart3,
} from "lucide-react";

export function ConnectedMonitor() {
  const kpis = [
    { label: "Total Revenue", value: "₹ 12,48,320", change: "+12%", isUp: true },
    { label: "Total Orders", value: "1,245", change: "+8%", isUp: true },
    { label: "Active Customers", value: "3,280", change: "+14%", isUp: true },
    { label: "Low Stock Items", value: "12", change: "-4%", isUp: false },
  ];

  const bars = [
    { m: "Jan", h: "42%" },
    { m: "Feb", h: "52%" },
    { m: "Mar", h: "64%" },
    { m: "Apr", h: "50%" },
    { m: "May", h: "72%" },
    { m: "Jun", h: "82%" },
    { m: "Jul", h: "68%" },
    { m: "Aug", h: "88%" },
    { m: "Sep", h: "100%" },
  ];

  const topProducts = [
    { name: "Premium Shirt", sales: "482" },
    { name: "Denim Jeans", sales: "421" },
    { name: "Sneakers", sales: "386" },
    { name: "Leather Belt", sales: "289" },
    { name: "Classic Watch", sales: "272" },
  ];

  return (
    <div className="relative select-none flex flex-col items-center">
      {/* Monitor Outer Frame & Bezel */}
      <div
        className="w-[490px] sm:w-[520px] h-[375px] sm:h-[395px] bg-[#111622] rounded-[18px] p-2.5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.65),0_10px_25px_-5px_rgba(0,0,0,0.45)] border border-slate-700/60 relative z-10 transition-transform duration-300"
        style={{ transform: "rotate(2.2deg)" }}
      >
        {/* Subtle camera lens dot at top center */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700" />

        {/* Screen Display Surface */}
        <div className="w-full h-full bg-[#FAFBFD] rounded-[10px] overflow-hidden flex flex-col border border-slate-200/90 text-slate-800">
          
          {/* Dashboard Header Bar */}
          <div className="h-10 bg-white border-b border-slate-100 px-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                  B
                </div>
                <span className="font-extrabold text-xs tracking-tight text-slate-900">
                  Bizonix
                </span>
              </div>

              {/* Search input mock */}
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 rounded-md px-2 py-1 text-[10px] text-slate-400 w-36">
                <Search className="w-3 h-3 text-slate-400" />
                <span>Search anything...</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <Bell className="w-3.5 h-3.5" />
              </button>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 border border-white shadow-2xs" />
            </div>
          </div>

          {/* Mini Nav / App Tabs */}
          <div className="h-7 bg-slate-50/90 border-b border-slate-100 px-3 flex items-center gap-2 text-[10px] font-medium text-slate-500 overflow-hidden shrink-0">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-semibold shadow-2xs">
              Dashboard
            </span>
            <span className="hover:text-slate-800 cursor-pointer">Inventory</span>
            <span className="hover:text-slate-800 cursor-pointer">Sales</span>
            <span className="hover:text-slate-800 cursor-pointer">Purchasing</span>
            <span className="hover:text-slate-800 cursor-pointer">Commerce</span>
            <span className="hover:text-slate-800 cursor-pointer">Accounting</span>
            <span className="hover:text-slate-800 cursor-pointer">Customers</span>
            <span className="hover:text-slate-800 cursor-pointer">Reports</span>
          </div>

          {/* Main Dashboard Canvas */}
          <div className="p-3 flex-1 overflow-hidden flex flex-col gap-2.5">
            {/* Greeting & Filter Row */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[13px] font-extrabold text-slate-900 leading-none">
                  Good morning!
                </h4>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Here's what's happening across your business today.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                <span>This Month</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </div>
            </div>

            {/* 4 Small KPI Cards */}
            <div className="grid grid-cols-4 gap-1.5">
              {kpis.map((k, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-2 border border-slate-100 shadow-2xs flex flex-col"
                >
                  <span className="text-[8.5px] font-medium text-slate-400 truncate">
                    {k.label}
                  </span>
                  <div className="text-[12px] font-bold text-slate-900 tracking-tight mt-0.5">
                    {k.value}
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {k.isUp ? (
                      <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5 text-rose-500" />
                    )}
                    <span
                      className={`text-[8px] font-bold ${
                        k.isUp ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {k.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lower Analytics Row: Revenue Trends + Top Selling */}
            <div className="grid grid-cols-7 gap-2 flex-1 items-stretch">
              {/* Revenue Trends Chart (4 cols) */}
              <div className="col-span-4 bg-white rounded-lg p-2.5 border border-slate-100 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-800">Revenue Trends</span>
                  <div className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-bold">
                    <span>₹ 4,28,320</span>
                    <span className="text-emerald-600 font-extrabold">+16%</span>
                  </div>
                </div>

                {/* Vertical Bar Chart */}
                <div className="flex items-end gap-1.5 h-16 pt-2 px-1">
                  {bars.map((b, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400"
                        style={{ height: b.h }}
                      />
                      <span className="text-[6.5px] text-slate-400 font-medium">{b.m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Products (3 cols) */}
              <div className="col-span-3 bg-white rounded-lg p-2.5 border border-slate-100 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-800">Top Selling</span>
                  <span className="text-[8px] font-semibold text-blue-600 cursor-pointer">View all →</span>
                </div>

                <div className="space-y-1">
                  {topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-[8px]">
                      <div className="flex items-center gap-1.5 truncate">
                        <div className="w-3 h-3 rounded bg-slate-100 shrink-0 flex items-center justify-center text-[7px] text-slate-400">
                          {i + 1}
                        </div>
                        <span className="font-medium text-slate-700 truncate">{p.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">{p.sales}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Realistic Monitor Stand Base with Perspective */}
      <div
        className="w-24 h-9 bg-gradient-to-b from-slate-700 to-slate-900 rounded-b-md shadow-lg -mt-1 relative z-0 border-t border-slate-600/40"
        style={{ transform: "perspective(300px) rotateX(25deg) rotate(2.2deg)" }}
      >
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-44 h-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-full shadow-[0_12px_24px_rgba(0,0,0,0.8)] border border-slate-600/30" />
      </div>
    </div>
  );
}
