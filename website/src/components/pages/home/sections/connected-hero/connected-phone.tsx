import React from "react";
import { X, Home, ShoppingBag, Box, MoreHorizontal } from "lucide-react";

export function ConnectedPhone() {
  return (
    <div
      className="w-[142px] sm:w-[150px] h-[295px] sm:h-[310px] bg-[#0E131F] rounded-[30px] p-2 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.85),0_12px_24px_rgba(0,0,0,0.6)] border-2 border-slate-700/80 relative select-none transition-transform duration-300"
      style={{ transform: "rotate(1.8deg)" }}
    >
      {/* Top Speaker / Dynamic Island Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-full z-20 flex items-center justify-end px-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800" />
      </div>

      {/* Screen Surface */}
      <div className="w-full h-full bg-white rounded-[22px] overflow-hidden flex flex-col pt-4 text-slate-800 relative z-10 border border-slate-200">
        
        {/* Top Mini Header */}
        <div className="px-2.5 pt-1 pb-1.5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded bg-blue-600 flex items-center justify-center text-white text-[7px] font-bold">
              B
            </div>
            <span className="font-extrabold text-[9px] text-slate-900">Bizonix</span>
          </div>
          <X className="w-3 h-3 text-slate-400 cursor-pointer" />
        </div>

        {/* Content Area */}
        <div className="p-2 flex-1 flex flex-col items-center justify-between">
          <div className="w-full text-left">
            <span className="text-[9px] font-bold text-slate-900 block leading-tight">
              Inventory Overview
            </span>
          </div>

          {/* Donut Ring Mockup */}
          <div className="relative w-20 h-20 flex items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600"
                strokeDasharray="80, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-teal-400"
                strokeDasharray="15, 100"
                strokeDashoffset="-80"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[12px] font-extrabold text-slate-900 leading-none">
                8,420
              </span>
              <span className="text-[6.5px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                In Stock
              </span>
            </div>
          </div>

          {/* Stat Breakdown Rows */}
          <div className="w-full space-y-1 my-1">
            <div className="flex items-center justify-between text-[7.5px]">
              <div className="flex items-center gap-1 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Low Stock</span>
              </div>
              <span className="font-bold text-slate-900">12</span>
            </div>

            <div className="flex items-center justify-between text-[7.5px]">
              <div className="flex items-center gap-1 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>On Order</span>
              </div>
              <span className="font-bold text-slate-900">320</span>
            </div>

            <div className="flex items-center justify-between text-[7.5px]">
              <div className="flex items-center gap-1 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Total SKUs</span>
              </div>
              <span className="font-bold text-slate-900">8,420</span>
            </div>
          </div>

          {/* Primary Mobile Action Button */}
          <button
            type="button"
            className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-[8px] font-bold shadow-xs hover:bg-blue-700 transition-colors"
          >
            Manage Inventory
          </button>
        </div>

        {/* Bottom Mobile Tab Bar */}
        <div className="h-6 bg-slate-50 border-t border-slate-100 px-2 flex items-center justify-around text-slate-400 text-[6.5px]">
          <div className="flex flex-col items-center text-blue-600 font-bold">
            <Home className="w-2.5 h-2.5" />
            <span>Home</span>
          </div>
          <div className="flex flex-col items-center">
            <ShoppingBag className="w-2.5 h-2.5" />
            <span>Orders</span>
          </div>
          <div className="flex flex-col items-center">
            <Box className="w-2.5 h-2.5" />
            <span>Products</span>
          </div>
          <div className="flex flex-col items-center">
            <MoreHorizontal className="w-2.5 h-2.5" />
            <span>More</span>
          </div>
        </div>

      </div>
    </div>
  );
}
