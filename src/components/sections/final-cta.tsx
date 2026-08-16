"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  MessageCircle,
  Building2,
  Store,
  ShoppingBag,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const logs = [
  { text: "POS Counter #04 UPI Sale -> stock adjusted (-3 pcs)", type: "RT" },
  { text: "e-Way Bill generated for Wholesale batch #9281", type: "WS" },
  {
    text: "Delhi franchise rule triggered -> auto-allocated 150 pcs",
    type: "FR",
  },
  { text: "Ledger reconciled: UPI match Ref 293810 complete", type: "AC" },
];

export function FinalCTA() {
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % logs.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const currentLog = logs[logIndex];

  return (
    <section className="section bg-white relative overflow-hidden py-16 md:py-24">
      {/* Decorative layout grid line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-slate-100" />

      <div className="shell">
        <div className="bg-gradient-to-br from-[#0b1f3a] to-[#071628] rounded-[48px] border border-slate-800 p-8 md:p-14 lg:p-20 relative overflow-hidden shadow-2xl text-white">
          {/* Subtle grid mesh overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Radial glows */}
          <div className="absolute -right-20 -bottom-20 size-[400px] bg-bz-blue/15 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />
          <div className="absolute -left-20 -top-20 size-[300px] bg-bz-teal/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Side: Copy and Actions */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-bz-blue bg-bz-blue/10 border border-bz-blue/20 px-3.5 py-1.5 rounded-full">
                Bring the real workflow
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                Run wholesale, retail &amp; franchise as{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-bz-blue to-bz-teal">
                  one business
                </span>
                .
              </h2>

              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                Stop managing three disconnected tools. Bizonix ties warehouse
                allocations, branch billing, franchise governance, and
                double-entry books into a single commercial context.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <ButtonLink
                  href="/contact"
                  className="px-8 py-3.5 font-bold shadow-lg"
                >
                  Book a workflow demo <ArrowRight size={16} />
                </ButtonLink>
                <ButtonLink
                  href={siteConfig.whatsappUrl}
                  variant="secondary"
                  className="px-8 py-3.5 font-bold text-white border-slate-700 hover:border-slate-500"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </ButtonLink>
              </div>

              {/* Quick stats strip */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-xl md:text-2xl font-bold text-white">
                    100%
                  </span>
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                    GST Compliant
                  </span>
                </div>
                <div>
                  <span className="block text-xl md:text-2xl font-bold text-white">
                    Live
                  </span>
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                    Piece Tracking
                  </span>
                </div>
                <div>
                  <span className="block text-xl md:text-2xl font-bold text-white">
                    Real-time
                  </span>
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                    Audit Trail
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Interactive Workflow Visualizer */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-slate-950/60 backdrop-blur-md rounded-[32px] border border-slate-800/85 p-6 w-full max-w-md h-[270px] overflow-hidden flex flex-col justify-between shadow-[0_24px_50px_rgba(0,0,0,0.3)] relative group">
                {/* SVG connection lines with flow dash offsets */}
                <svg
                  className="absolute inset-0 size-full overflow-visible"
                  viewBox="0 0 200 200"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2f6bff" />
                      <stop offset="100%" stopColor="#2ec4b6" />
                    </linearGradient>
                  </defs>
                  {/* WH line */}
                  <path
                    d="M 100 80 Q 50 80 50 130"
                    fill="none"
                    stroke={
                      currentLog.type === "WS" || currentLog.type === "AC"
                        ? "url(#glowGrad)"
                        : "#1e293b"
                    }
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    className="transition-colors duration-500"
                    style={
                      currentLog.type === "WS" || currentLog.type === "AC"
                        ? { animation: "dash 1.2s linear infinite" }
                        : {}
                    }
                  />
                  {/* RT line */}
                  <path
                    d="M 100 80 Q 100 110 100 130"
                    fill="none"
                    stroke={
                      currentLog.type === "RT" || currentLog.type === "AC"
                        ? "url(#glowGrad)"
                        : "#1e293b"
                    }
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    className="transition-colors duration-500"
                    style={
                      currentLog.type === "RT" || currentLog.type === "AC"
                        ? { animation: "dash 1.2s linear infinite" }
                        : {}
                    }
                  />
                  {/* FR line */}
                  <path
                    d="M 100 80 Q 150 80 150 130"
                    fill="none"
                    stroke={
                      currentLog.type === "FR" || currentLog.type === "AC"
                        ? "url(#glowGrad)"
                        : "#1e293b"
                    }
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    className="transition-colors duration-500"
                    style={
                      currentLog.type === "FR" || currentLog.type === "AC"
                        ? { animation: "dash 1.2s linear infinite" }
                        : {}
                    }
                  />
                </svg>

                {/* Nodes row top */}
                <div className="flex flex-col items-center">
                  {/* Central HQ Hub Node */}
                  <div className="size-14 rounded-full bg-slate-900 border-2 border-bz-blue flex items-center justify-center shadow-[0_0_20px_rgba(47,107,255,0.3)] relative z-10 animate-[pulse_3s_infinite]">
                    <div className="size-8 rounded-full bg-bz-blue flex items-center justify-center text-white text-[10px] font-black">
                      HQ
                    </div>
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 font-mono">
                    Bizonix core
                  </span>
                </div>

                {/* Nodes row bottom */}
                <div className="flex justify-between px-4 relative z-10">
                  {/* Wholesale Node */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`size-11 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                        currentLog.type === "WS" || currentLog.type === "AC"
                          ? "bg-bz-blue border-bz-blue text-white shadow-[0_0_15px_rgba(47,107,255,0.4)] scale-110"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <Building2 size={16} />
                    </div>
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 font-mono">
                      Wholesale
                    </span>
                  </div>

                  {/* Retail Node */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`size-11 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                        currentLog.type === "RT" || currentLog.type === "AC"
                          ? "bg-bz-teal border-bz-teal text-white shadow-[0_0_15px_rgba(46,196,182,0.4)] scale-110"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <ShoppingBag size={16} />
                    </div>
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 font-mono">
                      Retail POS
                    </span>
                  </div>

                  {/* Franchise Node */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`size-11 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                        currentLog.type === "FR" || currentLog.type === "AC"
                          ? "bg-amber-500 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-110"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <Store size={16} />
                    </div>
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 font-mono">
                      Franchise
                    </span>
                  </div>
                </div>

                {/* Event Logs console */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[9px] min-h-[46px] flex items-center shadow-inner relative z-10">
                  <div className="flex gap-2 items-start w-full">
                    <span className="text-emerald-500 font-bold animate-pulse">
                      &gt;_
                    </span>
                    <p className="text-slate-300 leading-normal flex-1 animate-[fadeIn_300ms_ease] key-{logIndex}">
                      {currentLog.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local SVG path dashboard animation style */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
