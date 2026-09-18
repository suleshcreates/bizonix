import React from "react";
import {
  Store,
  Globe,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ShoppingBag,
  Layers,
  Sparkles,
} from "lucide-react";

export function CommerceHeroVisual() {
  const liveChannels = [
    { name: "Web Storefront", icon: Globe, status: "Live", count: "1,240 visits/hr", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { name: "Retail POS (42 Stores)", icon: Store, status: "Connected", count: "89 billing now", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { name: "Marketplaces", icon: Smartphone, status: "Synced", count: "Amazon • Flipkart", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  ];

  const recentOrders = [
    { id: "ORD-9481", channel: "Web Store", customer: "Aarav S.", amount: "₹4,250", items: "3 items", status: "Paid", time: "Just now" },
    { id: "POS-1102", channel: "Bandra Flagship", customer: "Walk-in Guest", amount: "₹18,900", items: "6 items", status: "Billed", time: "1m ago" },
    { id: "MKT-7734", channel: "Marketplace", customer: "Meera K.", amount: "₹2,890", items: "1 item", status: "Dispatched", time: "3m ago" },
  ];

  return (
    <div className="relative w-full max-w-[660px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

      {/* Main Glass Console */}
      <div className="relative bg-[#0D1527]/90 border border-slate-700/60 rounded-2xl shadow-2xl backdrop-blur-xl p-5 sm:p-6 text-slate-200 overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                Omnichannel Commerce Hub
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  Live Sync
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Single catalog & unified inventory dispatch</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-200 font-medium">99.98%</span>
            <span>Uptime</span>
          </div>
        </div>

        {/* Channel Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {liveChannels.map((ch, idx) => {
            const Icon = ch.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-medium text-slate-300 truncate">{ch.name}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${ch.color}`}>
                    {ch.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {ch.count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-Time Metrics Row */}
        <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/40 rounded-xl p-4 border border-blue-500/20 mb-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium mb-0.5 uppercase tracking-wider">
              Omnichannel Revenue Today
            </div>
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>₹4,82,650</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +24.6%
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium mb-0.5 uppercase tracking-wider">
              Live Orders
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              348
            </div>
          </div>
        </div>

        {/* Recent Unified Orders Stream */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Unified Order Stream
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Real-time feed
            </span>
          </div>

          <div className="space-y-2">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900/50 hover:bg-slate-900/80 rounded-lg px-3.5 py-2.5 border border-slate-800/80 flex items-center justify-between transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span className="font-mono text-slate-300">{ord.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 text-[11px]">{ord.channel}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {ord.customer} ({ord.items})
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className="font-semibold text-white font-mono">
                    {ord.amount}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{ord.status}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{ord.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Low Stock Hold Pill (Anchored at bottom right) */}
      <div className="hidden sm:flex absolute -bottom-4 -right-3 bg-[#0B132B]/95 border border-blue-500/40 rounded-xl px-4 py-2.5 shadow-xl backdrop-blur-md items-center gap-3 text-xs text-white z-30">
        <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="font-semibold text-slate-100 flex items-center gap-1">
            <span>Instant Stock Reservation</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 font-mono">0ms Lag</span>
          </div>
          <p className="text-[10px] text-slate-400">Store counter bill updates web storefront instantly</p>
        </div>
      </div>
    </div>
  );
}
