"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
  Network,
  Layers,
  ArrowRight,
  Store,
  Boxes,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { apiClient, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";

/* ------------------------------------------------------------------ */
/* BIZONIX LOGO                                                       */
/* ------------------------------------------------------------------ */
function BizonixBrandLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Geometric Prism Icon */}
      <svg
        width="42"
        height="42"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <path d="M26 3L47 15L26 27L5 15L26 3Z" fill="#2F6BFF" />
        <path d="M5 15L26 27V50L5 38V15Z" fill="#0B1F3A" />
        <path d="M47 15L26 27V50L47 38V15Z" fill="#2EC4B6" />
        <path
          d="M17 21L26 15.5L35 21L26 26.5L17 21Z"
          fill="white"
          fillOpacity="0.9"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-[26px] font-black tracking-tight leading-none text-[#0B1F3A]">
          bizonix
        </span>
        <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-slate-400 mt-1">
          OPERATIONS OS
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ENTERPRISE OPERATIONS CONSOLE (Replaces AI / Mascot)               */
/* ------------------------------------------------------------------ */
function OperationsConsoleVisual() {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/25 via-teal-400/20 to-indigo-500/25 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Console Card */}
      <div className="relative rounded-3xl bg-white/[0.09] backdrop-blur-xl border border-white/25 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Console Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              Live Network Pulse
            </span>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/15 text-blue-100 border border-white/20 flex items-center gap-1.5">
            <Store className="w-3 h-3 text-teal-300" />
            38 Outlets Connected
          </span>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200/80 block mb-1">
              Throughput
            </span>
            <div className="text-lg font-black text-white leading-none">
              ₹24.8L
            </div>
            <div className="text-[10px] text-emerald-300 font-bold mt-1.5 flex items-center gap-0.5">
              <span>↑</span> +16.8% today
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200/80 block mb-1">
              Inventory Sync
            </span>
            <div className="text-lg font-black text-white leading-none">
              99.98%
            </div>
            <div className="text-[10px] text-teal-200 font-semibold mt-1.5">
              Zero Drift
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200/80 block mb-1">
              POS Terminals
            </span>
            <div className="text-lg font-black text-white leading-none">
              142/142
            </div>
            <div className="text-[10px] text-blue-200 font-semibold mt-1.5">
              All Active
            </div>
          </div>
        </div>

        {/* Active Multi-location Stock Pipeline */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15 mb-4">
          <div className="flex items-center justify-between text-xs text-white/90 mb-2.5">
            <span className="font-bold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-teal-300" />
              Stock Rebalance Pipeline
            </span>
            <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              In Transit
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-blue-100 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Central DC</span>
            </div>

            {/* Dotted Route Connector */}
            <div className="flex-1 flex items-center justify-center px-2">
              <div className="h-[2px] w-full bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 rounded-full opacity-80" />
            </div>

            <div className="flex items-center gap-1.5 text-blue-100 font-semibold text-[11px]">
              <span>Outlet #12</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
            <span>SKU #BZ-9042 · 850 units</span>
            <span className="font-mono text-teal-200">ETA 28 min</span>
          </div>
        </div>

        {/* Bottom Real-time Transaction Ledger Ping */}
        <div className="flex items-center justify-between text-[11px] text-white/80 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Automated inventory sync across 38 retail locations</span>
          </div>
          <span className="text-white/40 text-[10px]">Just now</span>
        </div>
      </div>

      {/* Floating Accent Validation Badge */}
      <div className="absolute -bottom-4 -right-3 bg-white rounded-2xl shadow-2xl p-3.5 border border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#0B1F3A]">
            Ledger Reconciled
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            3,480 orders verified
          </div>
        </div>
      </div>
    </div>
  );
}

const FOOTER_PILLARS = [
  { label: "SECURE", icon: ShieldCheck },
  { label: "INSIGHTFUL", icon: TrendingUp },
  { label: "CONNECTED", icon: Network },
  { label: "ENTERPRISE", icon: Layers },
];

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiClient.post("/auth/login", { email, password });
      const user = await apiClient.get<any>("/auth/me");
      login(user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Invalid credentials or server connection error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* ============================================================ */}
      {/* LEFT COLUMN — Sign-in Form                                   */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between px-8 py-10 sm:px-16 md:px-24 lg:px-14 xl:px-24 min-h-screen lg:min-h-0 bg-white">
        {/* Top Brand Logo */}
        <div className="pt-2">
          <BizonixBrandLogo />
        </div>

        {/* Center Sign In Box */}
        <div className="w-full max-w-[390px] mx-auto my-auto py-10">
          <div className="mb-7">
            <h1 className="text-[34px] sm:text-[38px] font-bold text-[#0f172a] tracking-tight leading-tight">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-normal">
              Use your Bizonix admin account to continue.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Work email or username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@bizonix.com or username"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062eb]/20 focus:border-[#0062eb] transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#0062eb] hover:underline"
                >
                  Forgot it?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062eb]/20 focus:border-[#0062eb] transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Sign in Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl text-base font-semibold text-white bg-[#0062eb] hover:bg-[#0052c7] active:bg-[#0047ad] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </div>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Minimal Copyright */}
        <div className="text-xs text-slate-400 pb-2">
          © {new Date().getFullYear()} Bizonix Technologies Inc. All rights reserved.
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN — Solid Blue Panel with Operations Console      */}
      {/* ============================================================ */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden select-none"
        style={{
          background: "linear-gradient(145deg, #0052cc 0%, #0062eb 45%, #0047b3 100%)",
        }}
      >
        {/* Dynamic Stylized Background Diagonal Waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute -right-20 -top-20 w-[800px] h-[800px] opacity-20"
            viewBox="0 0 500 500"
            fill="none"
          >
            <path
              d="M150 0 C220 150 350 250 500 320 L500 0 Z"
              fill="white"
            />
            <path
              d="M0 250 C180 300 320 400 450 500 L0 500 Z"
              fill="white"
            />
          </svg>
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Top Tagline / Headline */}
        <div className="relative z-10 max-w-xl">
          <h2 className="text-[40px] xl:text-[46px] font-extrabold text-white tracking-tight leading-[1.12]">
            Bizonix guides the flow.
            <br />
            You drive the growth.
          </h2>
          <p className="mt-4 text-blue-100/90 text-sm xl:text-[15px] leading-relaxed max-w-lg font-normal">
            Manufacturing, warehousing, multi-store distribution, and customer
            loyalty — unified in one reliable system of record.
          </p>
        </div>

        {/* Center Section: Enterprise Operations Console Showcase */}
        <div className="relative z-10 my-auto py-8 w-full max-w-xl">
          <OperationsConsoleVisual />
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 w-full max-w-xl flex items-center justify-between pt-4 border-t border-white/15">
          {FOOTER_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.label}
                className="flex items-center gap-2 text-white/80 tracking-[0.16em] text-[12px] xl:text-[13px] font-bold uppercase hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4 text-blue-200" />
                <span>{pillar.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


