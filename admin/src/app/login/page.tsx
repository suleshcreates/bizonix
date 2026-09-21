"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
  Network,
  Layers,
  ArrowRight,
  ArrowLeft,
  Store,
  Boxes,
  Truck,
  CheckCircle2,
  Lock,
  Mail,
  KeyRound,
  RefreshCw,
  AlertCircle,
  Check,
  Sparkles,
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

  // Auth View: "LOGIN" | "FORGOT_PASSWORD"
  const [authView, setAuthView] = useState<"LOGIN" | "FORGOT_PASSWORD">("LOGIN");

  // Forgot Password Flow States
  const [resetStep, setResetStep] = useState<1 | 2 | 3 | 4>(1);
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetCompleteUser, setResetCompleteUser] = useState<any>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Resend Countdown Timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Step 4 Auto Redirect Timer
  useEffect(() => {
    if (resetStep === 4 && redirectCountdown !== null && redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000);
      return () => clearTimeout(timer);
    } else if (resetStep === 4 && redirectCountdown === 0) {
      if (resetCompleteUser) {
        login(resetCompleteUser);
      } else {
        router.push("/dashboard");
      }
    }
  }, [resetStep, redirectCountdown, resetCompleteUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiClient.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });
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

  const handleOpenForgotPassword = () => {
    setAuthView("FORGOT_PASSWORD");
    setResetStep(1);
    setResetIdentifier(email || "");
    setResetError("");
    setDevOtp(null);
  };

  const handleBackToLogin = () => {
    setAuthView("LOGIN");
    setResetStep(1);
    setResetError("");
    setDevOtp(null);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      setResetError("Please enter your registered email or username.");
      return;
    }
    setResetLoading(true);
    setResetError("");

    try {
      const res = await apiClient.post<any>("/auth/forgot-password", {
        identifier: resetIdentifier.trim(),
      });
      setTargetEmail(res.email || resetIdentifier.trim());
      setMaskedEmail(res.maskedEmail || res.email || resetIdentifier.trim());
      setDevOtp(res.devOtp || null);
      setOtpInput("");
      setResetStep(2);
      setResendCooldown(30);
    } catch (err: any) {
      setResetError(err?.message || "Failed to send verification code. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setResetError("Please enter the 6-digit verification code.");
      return;
    }
    setResetLoading(true);
    setResetError("");

    try {
      const res = await apiClient.post<any>("/auth/verify-otp", {
        email: targetEmail,
        otp: otpInput.trim(),
      });
      setResetToken(res.resetToken);
      setResetStep(3);
    } catch (err: any) {
      setResetError(err?.message || "Invalid or expired verification code.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    setResetLoading(true);
    setResetError("");

    try {
      const res = await apiClient.post<any>("/auth/reset-password", {
        email: targetEmail,
        resetToken,
        newPassword: newPassword.trim(),
      });
      if (res?.user) {
        setResetCompleteUser(res.user);
      }
      setResetStep(4);
      setRedirectCountdown(3);
    } catch (err: any) {
      setResetError(err?.message || "Failed to reset password. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* ============================================================ */}
      {/* LEFT COLUMN — Sign-in / Forgot Password Form                 */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between px-8 py-10 sm:px-16 md:px-24 lg:px-14 xl:px-24 min-h-screen lg:min-h-0 bg-white">
        {/* Top Brand Logo */}
        <div className="pt-2">
          <BizonixBrandLogo />
        </div>

        {/* Center Box */}
        <div className="w-full max-w-[390px] mx-auto my-auto py-10">
          {authView === "LOGIN" ? (
            <>
              <div className="mb-7">
                <h1 className="text-[34px] sm:text-[38px] font-bold text-[#0f172a] tracking-tight leading-tight">
                  Sign in
                </h1>
                <p className="mt-2 text-sm text-slate-500 font-normal">
                  Use your Bizonix admin or employee account to continue.
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
                      onClick={handleOpenForgotPassword}
                      className="text-xs font-semibold text-[#0062eb] hover:underline cursor-pointer"
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
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
                    className="w-full h-12 rounded-xl text-base font-semibold text-white bg-[#0062eb] hover:bg-[#0052c7] active:bg-[#0047ad] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
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
            </>
          ) : (
            /* ========================================================== */
            /* FORGOT PASSWORD MULTI-STEP FLOW                             */
            /* ========================================================== */
            <div className="animate-in fade-in duration-200">
              {/* Step 1: Request OTP */}
              {resetStep === 1 && (
                <div>
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to sign in</span>
                    </button>
                    <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0f172a] tracking-tight leading-tight">
                      Reset Password
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                      Enter your registered work email or username. We’ll verify your account with a 6-digit security code.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleRequestOtp}>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="resetIdentifier"
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        Work Email or Username
                      </label>
                      <div className="relative">
                        <input
                          id="resetIdentifier"
                          name="resetIdentifier"
                          type="text"
                          required
                          value={resetIdentifier}
                          onChange={(e) => setResetIdentifier(e.target.value)}
                          placeholder="e.g. admin@bizonix.com or admin"
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062eb]/20 focus:border-[#0062eb] transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {resetError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{resetError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full h-12 rounded-xl text-sm font-semibold text-white bg-[#0062eb] hover:bg-[#0052c7] active:bg-[#0047ad] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {resetLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending code…</span>
                        </div>
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: Enter 6-digit OTP */}
              {resetStep === 2 && (
                <div>
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setResetStep(1);
                        setResetError("");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change identifier</span>
                    </button>
                    <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0f172a] tracking-tight leading-tight">
                      Enter Security Code
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                      We sent a 6-digit verification code to{" "}
                      <strong className="text-slate-900 font-mono">{maskedEmail}</strong>.
                    </p>
                  </div>

                  {/* Dev / Dummy Email Auto-Fill Banner */}
                  {devOtp && (
                    <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Dev / Dummy Email Verification</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpInput(devOtp)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                        >
                          Auto-fill Code
                        </button>
                      </div>
                      <p className="text-[11px] text-blue-700 leading-snug">
                        Since this account uses a local or simulation email, your temporary code is{" "}
                        <strong className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-blue-300 select-all">
                          {devOtp}
                        </strong>
                        .
                      </p>
                    </div>
                  )}

                  <form className="space-y-4" onSubmit={handleVerifyOtp}>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="otpInput"
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider text-center"
                      >
                        6-Digit Security Code
                      </label>
                      <input
                        id="otpInput"
                        name="otpInput"
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="••••••"
                        className="w-full h-14 px-4 text-center text-2xl font-bold tracking-[0.35em] font-mono rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0062eb]/20 focus:border-[#0062eb] transition-all placeholder:text-slate-300"
                      />
                    </div>

                    {resetError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{resetError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading || otpInput.length !== 6}
                      className="w-full h-12 rounded-xl text-sm font-semibold text-white bg-[#0062eb] hover:bg-[#0052c7] active:bg-[#0047ad] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {resetLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying…</span>
                        </div>
                      ) : (
                        <>
                          <span>Verify Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        disabled={resendCooldown > 0 || resetLoading}
                        onClick={handleRequestOtp}
                        className="text-xs font-medium text-slate-500 hover:text-[#0062eb] disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {resendCooldown > 0
                          ? `Resend code in ${resendCooldown}s`
                          : "Didn’t receive a code? Resend code"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 3: Set New Password */}
              {resetStep === 3 && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0f172a] tracking-tight leading-tight">
                      Create New Password
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                      Identity verified for <strong className="text-slate-900">{targetEmail}</strong>. Enter your new strong password below.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleCompleteReset}>
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="newPassword"
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062eb]/20 focus:border-[#0062eb] transition-all placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062eb]/20 focus:border-[#0062eb] transition-all placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Validation Hints */}
                    <div className="space-y-1 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                            newPassword.length >= 8 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          ✓
                        </div>
                        <span className={newPassword.length >= 8 ? "text-emerald-700 font-medium" : ""}>
                          Minimum 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                            newPassword && newPassword === confirmPassword
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          ✓
                        </div>
                        <span className={newPassword && newPassword === confirmPassword ? "text-emerald-700 font-medium" : ""}>
                          Passwords match
                        </span>
                      </div>
                    </div>

                    {resetError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{resetError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading || newPassword.length < 8 || newPassword !== confirmPassword}
                      className="w-full h-12 rounded-xl text-sm font-semibold text-white bg-[#0062eb] hover:bg-[#0052c7] active:bg-[#0047ad] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {resetLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Updating password…</span>
                        </div>
                      ) : (
                        <>
                          <span>Save New Password</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Step 4: Success State */}
              {resetStep === 4 && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Password Reset Complete</h2>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Your account password has been updated and your session is verified.
                    </p>
                    {redirectCountdown !== null && (
                      <p className="text-xs font-semibold text-blue-600 pt-1">
                        Redirecting to dashboard in {redirectCountdown}s…
                      </p>
                    )}
                  </div>

                  <div className="pt-4 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (resetCompleteUser) {
                          login(resetCompleteUser);
                        } else {
                          router.push("/dashboard");
                        }
                      }}
                      className="w-full h-12 rounded-xl text-sm font-semibold text-white bg-[#0062eb] hover:bg-[#0052c7] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthView("LOGIN");
                        setEmail(targetEmail || resetIdentifier);
                        setPassword("");
                        setResetStep(1);
                        setResetError("");
                        setRedirectCountdown(null);
                      }}
                      className="w-full h-10 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Sign in with different credentials
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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


