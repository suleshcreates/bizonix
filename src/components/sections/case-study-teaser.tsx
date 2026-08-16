"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Activity,
  Building2,
  Store,
  Warehouse,
  Calculator,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";

// --- Node Data for Pratyush Multi-Entity Network ---
interface NetworkNode {
  id: string;
  name: string;
  category: string;
  icon: typeof Building2;
  status: string;
  kpis: { label: string; value: string }[];
  description: string;
  liveActivity: string;
  accent: string;
}

const networkNodes: NetworkNode[] = [
  {
    id: "hq-wh",
    name: "Central Hub & Warehouse",
    category: "HQ OPERATIONS",
    icon: Warehouse,
    status: "Operational · 99.98% sync",
    kpis: [
      { label: "Active Stock", value: "62,400 pcs" },
      { label: "GRN Accuracy", value: "99.94%" },
      { label: "Dispatch Rate", value: "840 pcs/hr" },
    ],
    description:
      "Centralized master catalog, vendor receiving, barcode batch serialization, and automated multi-branch allocation.",
    liveActivity: "Series batch #AU-4092 allocated to 3 franchise outlets",
    accent: "from-blue-500 to-indigo-600",
  },
  {
    id: "retail-stores",
    name: "8 Flagship Retail Stores",
    category: "COMPANY-OWNED POS",
    icon: Store,
    status: "8/8 Counters Live",
    kpis: [
      { label: "Avg POS Speed", value: "1.2s / item" },
      { label: "Today's Bills", value: "1,420 bills" },
      { label: "UPI Clearance", value: "100% auto" },
    ],
    description:
      "Rapid touch billing counters with piece-level barcode validation, store stock lookups, and unified cash/UPI drawer discipline.",
    liveActivity:
      "Counter #02 Mumbai billed JWL-R048 with instant invoice sync",
    accent: "from-teal-500 to-emerald-600",
  },
  {
    id: "franchise-partners",
    name: "12 Franchise Partners",
    category: "FRANCHISE NETWORK",
    icon: Building2,
    status: "12 Partners Active",
    kpis: [
      { label: "Auto-Indent", value: "Active" },
      { label: "Partner Credit", value: "Enforced" },
      { label: "Stock Visibility", value: "Real-time" },
    ],
    description:
      "Isolated partner workspaces with centralized catalog governance, automated replenishment rules, and restricted ledger views.",
    liveActivity:
      "Delhi Franchise indent for 150 pcs auto-approved within credit limit",
    accent: "from-amber-500 to-orange-600",
  },
  {
    id: "finance-tax",
    name: "Unified Accounts & GST",
    category: "CENTRAL FINANCE",
    icon: Calculator,
    status: "GSTR-1 Ready",
    kpis: [
      { label: "Reconciliation", value: "0 min lag" },
      { label: "Tax Invariant", value: "100% clean" },
      { label: "Month Close", value: "Same Day" },
    ],
    description:
      "Double-entry ledgers, receivables/payables, and GST invoicing automatically generated at the moment of operational movement.",
    liveActivity:
      "Auto-reconciled 420 digital payment settlements against bank feeds",
    accent: "from-purple-500 to-pink-600",
  },
];

const transformationComparison = [
  {
    metric: "Inventory Visibility",
    before: "Dispersed in spreadsheets; 3–5 day lag between warehouse & stores",
    after: "Single real-time piece barcode truth across all 20+ locations",
    gain: "+100% Accuracy",
  },
  {
    metric: "Franchise Governance",
    before:
      "Phone orders and manual WhatsApp indents with frequent credit disputes",
    after:
      "Rules-based automated partner indents locked to real-time credit limits",
    gain: "Zero Dispute Indents",
  },
  {
    metric: "Month-End Books Close",
    before: "5 to 7 days of manual Excel reconciliation and cross-checking",
    after:
      "Instant continuous reconciliation between operations and general ledger",
    gain: "-90% Close Time",
  },
  {
    metric: "GST & Tax Compliance",
    before: "High risk of manual re-entry errors across branch invoices",
    after:
      "Automated e-Invoices, e-Way bills, and consolidated GSTR preparation",
    gain: "100% Audit Ready",
  },
];

const liveStreamEvents = [
  {
    time: "Just now",
    tag: "POS",
    store: "Mumbai Showroom",
    text: "Gold Pendant JWL-G092 billed (₹18,400) · Stock deducted",
  },
  {
    time: "1m ago",
    tag: "FRANCHISE",
    store: "Delhi Partner #02",
    text: "Replenishment indent #FR-881 auto-allocated 45 pcs from HQ",
  },
  {
    time: "3m ago",
    tag: "WAREHOUSE",
    store: "Surat Central WH",
    text: "GRN-204 verified · 240 pcs serialized and barcode tags printed",
  },
  {
    time: "5m ago",
    tag: "FINANCE",
    store: "HQ Accounts",
    text: "Auto-matched ₹3.4L settlement against HDFC bank merchant feed",
  },
  {
    time: "8m ago",
    tag: "TRANS-SHIP",
    store: "Jaipur Outlet",
    text: "Inter-branch transfer IBT-109 received and scanned into shelf stock",
  },
];

export function CaseStudyTeaser() {
  const [activeTab, setActiveTab] = useState<
    "topology" | "comparison" | "stream"
  >("topology");
  const [selectedNode, setSelectedNode] = useState<string>("hq-wh");
  const [todayTransactions, setTodayTransactions] = useState(3842);
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);

  // Dynamic ticker for transactions
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayTransactions((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle live stream
  useEffect(() => {
    const streamInterval = setInterval(() => {
      setActiveStreamIndex((prev) => (prev + 1) % liveStreamEvents.length);
    }, 3500);
    return () => clearInterval(streamInterval);
  }, []);

  const currentNode =
    networkNodes.find((n) => n.id === selectedNode) || networkNodes[0];

  return (
    <section className="section bg-slate-950 text-white relative overflow-hidden py-20 md:py-28">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(47,107,255,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Glowing atmospheric orbs */}
      <div className="absolute top-1/4 -left-32 size-[450px] bg-bz-blue/15 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 -right-32 size-[450px] bg-bz-teal/15 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[10000ms]" />

      <div className="shell relative z-10">
        {/* Section Header with Enterprise Telemetry Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-slate-800/80">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 text-xs font-mono backdrop-blur-md shadow-inner">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
              </span>
              <span className="font-extrabold uppercase tracking-widest text-[10px] text-slate-300">
                Flagship Enterprise Deployment
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-bold text-[11px]">
                Production Live
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Pratyush Retails.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bz-blue via-sky-400 to-bz-teal">
                20+ Entities on One Core.
              </span>
            </h2>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
              From high-value jewellery retail and central warehousing to
              multi-franchise allocation and real-time GST books—see how
              Pratyush eliminated operational silos with Bizonix ERP.
            </p>
          </div>

          {/* Quick Metrics HUD Strip */}
          <div className="flex flex-wrap lg:flex-col gap-4 lg:items-end">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 min-w-[200px] backdrop-blur-md">
              <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
                <span>Today&apos;s Transactions</span>
                <Activity
                  size={14}
                  className="text-emerald-400 animate-pulse"
                />
              </div>
              <div className="text-2xl md:text-3xl font-black font-mono text-white mt-1">
                {todayTransactions.toLocaleString()}
                <span className="text-xs text-emerald-400 font-bold ml-2">
                  ↑ Live
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Across 8 Stores &amp; 12 Franchises
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Mode Controller Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 pb-8">
          <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("topology")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "topology"
                  ? "bg-bz-blue text-white shadow-[0_0_20px_rgba(47,107,255,0.4)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Building2 size={15} />
              <span>Multi-Entity Network Topology</span>
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "comparison"
                  ? "bg-bz-blue text-white shadow-[0_0_20px_rgba(47,107,255,0.4)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <TrendingUp size={15} />
              <span>Transformation Impact</span>
            </button>
            <button
              onClick={() => setActiveTab("stream")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "stream"
                  ? "bg-bz-blue text-white shadow-[0_0_20px_rgba(47,107,255,0.4)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Activity size={15} />
              <span>Live Audit Stream</span>
            </button>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-bold text-bz-teal hover:text-white transition group"
          >
            <span>Schedule architecture review for your brand</span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition"
            />
          </Link>
        </div>

        {/* TAB 1: MULTI-ENTITY NETWORK TOPOLOGY */}
        {activeTab === "topology" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-[fadeIn_300ms_ease]">
            {/* Left: Interactive Entity Node Selector */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Select Entity Node to Inspect Telemetry
              </span>
              {networkNodes.map((node) => {
                const IconComponent = node.icon;
                const isSelected = selectedNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`group cursor-pointer rounded-2xl p-4 md:p-5 border transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? "bg-slate-900 border-bz-blue/60 shadow-[0_8px_32px_rgba(47,107,255,0.15)]"
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70"
                    }`}
                  >
                    {/* Active highlight side bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-bz-blue to-bz-teal" />
                    )}

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-bz-blue text-white shadow-md"
                              : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                          }`}
                        >
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-bz-teal block">
                            {node.category}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-0.5">
                            {node.name}
                          </h4>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-2">
                      {node.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Live Telemetry Inspection Console */}
            <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 size-64 bg-bz-blue/10 rounded-full blur-3xl pointer-events-none" />

              {/* Console Window Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-rose-500/80" />
                    <span className="size-2.5 rounded-full bg-amber-500/80" />
                    <span className="size-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-xs text-slate-400 ml-2">
                    pratyush://telemetry/{currentNode.id}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  ● REAL-TIME SYNC
                </span>
              </div>

              {/* Node Details Header */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-bz-teal">
                  {currentNode.category} · NODE SPEC
                </span>
                <h3 className="text-2xl font-black text-white">
                  {currentNode.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentNode.description}
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {currentNode.kpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3.5 text-center shadow-inner"
                  >
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      {kpi.label}
                    </span>
                    <span className="text-base md:text-xl font-mono font-extrabold text-white block mt-1">
                      {kpi.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Live Event Stream for Node */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-2 mb-3">
                  <span className="font-bold uppercase tracking-wider">
                    Active Stream Pipeline
                  </span>
                  <span>ID: PRATYUSH-CLUSTER-01</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="size-2 rounded-full bg-bz-blue mt-1.5 animate-ping flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-bz-blue font-bold block mb-0.5">
                      LATEST TRANSACTION PULSE
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {currentNode.liveActivity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operational Verification Badge */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck size={15} className="text-bz-teal" />
                  <span>Enforced with Bizonix Multi-Tenant RBAC</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  Latency: 14ms
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSFORMATION COMPARISON */}
        {activeTab === "comparison" && (
          <div className="space-y-6 animate-[fadeIn_300ms_ease]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-rose-900/30 rounded-3xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <span className="size-2 rounded-full bg-rose-500" />
                  <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-rose-400">
                    Before Bizonix (Fragmented Silos)
                  </h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Pratyush operated on separate billing software for stores,
                  detached Excel sheets for warehouse allocations, and manual
                  phone/WhatsApp coordination with franchise partners.
                </p>
                <div className="mt-6 space-y-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2 text-rose-400/90">
                    <span>✕ 3 disconnected software tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-400/90">
                    <span>
                      ✕ 5-day lag on month-end financial reconciliations
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-400/90">
                    <span>
                      ✕ Unverifiable stock drift between partner stores
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-emerald-400">
                    With Bizonix ERP (Unified Engine)
                  </h4>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  One operating truth across Surat HQ, 8 flagship stores, 12
                  franchise outlets, and central accounts. Every barcode piece
                  is audited from supplier arrival to counter checkout.
                </p>
                <div className="mt-6 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} className="stroke-[3]" />
                    <span>
                      Single piece-level inventory ledger across all 20+
                      entities
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} className="stroke-[3]" />
                    <span>
                      Automated partner indents controlled by live credit limits
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} className="stroke-[3]" />
                    <span>
                      Real-time GST invoice generation and instant bank
                      reconciliation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Matrix Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8">
              <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 mb-6">
                Metric by Metric Transformation
              </h4>
              <div className="space-y-4">
                {transformationComparison.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80"
                  >
                    <div className="md:col-span-3">
                      <span className="font-bold text-sm text-white block">
                        {item.metric}
                      </span>
                    </div>
                    <div className="md:col-span-4 text-xs text-slate-400">
                      <span className="text-[9px] font-mono uppercase text-rose-400/80 block mb-0.5">
                        Legacy:
                      </span>
                      {item.before}
                    </div>
                    <div className="md:col-span-4 text-xs text-slate-200">
                      <span className="text-[9px] font-mono uppercase text-emerald-400 block mb-0.5">
                        Bizonix:
                      </span>
                      {item.after}
                    </div>
                    <div className="md:col-span-1 text-right">
                      <span className="inline-block font-mono text-[10px] font-bold text-bz-teal bg-bz-teal/10 px-2 py-1 rounded border border-bz-teal/20">
                        {item.gain}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE AUDIT STREAM */}
        {activeTab === "stream" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 animate-[fadeIn_300ms_ease]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-emerald-500 animate-ping" />
                <h4 className="font-mono text-sm font-bold text-white">
                  Live Enterprise Transaction Feed
                </h4>
              </div>
              <span className="font-mono text-xs text-slate-400">
                Auto-streaming 12 events/min
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {liveStreamEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    activeStreamIndex === idx
                      ? "bg-slate-950 border-bz-blue text-white shadow-[0_0_20px_rgba(47,107,255,0.2)]"
                      : "bg-slate-950/40 border-slate-800/80 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-bold w-16 flex-shrink-0">
                      {evt.time}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                        evt.tag === "POS"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : evt.tag === "FRANCHISE"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : evt.tag === "WAREHOUSE"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {evt.tag}
                    </span>
                    <span className="text-slate-300 font-bold text-xs">
                      {evt.store}
                    </span>
                  </div>
                  <p className="text-slate-300 flex-1 sm:text-right text-xs leading-normal">
                    {evt.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Quote Callout & Case Study Link Banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-bz-teal text-xs font-mono font-bold">
              <CheckCircle2 size={16} />
              <span>VERIFIED ENTERPRISE TRANSFORMATION</span>
            </div>
            <p className="text-slate-300 text-sm md:text-base italic leading-relaxed">
              &ldquo;Before Bizonix, our franchise network and central warehouse
              operated in silos with days of delayed visibility. Now, every
              single jewellery piece and billing transaction across all 20
              outlets is visible and accounted for in real time.&rdquo;
            </p>
            <span className="text-xs font-bold text-white block">
              — Leadership Team,{" "}
              <span className="text-bz-blue">Pratyush Retails</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-bz-blue hover:bg-bz-blue-hover text-white px-7 py-3.5 rounded-full text-xs font-bold transition shadow-lg"
            >
              <span>Book an architecture demo</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
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
