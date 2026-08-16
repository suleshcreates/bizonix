"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// --- Interactive Visual Subcomponents ---

function ApparelVisual() {
  const [hoveredCell, setHoveredCell] = useState<{
    r: number;
    c: number;
  } | null>(null);

  const sizes = ["S", "M", "L", "XL"];
  const colors = [
    { name: "Navy", class: "bg-blue-900" },
    { name: "Olive", class: "bg-olive-600 bg-emerald-800" },
    { name: "Char", class: "bg-slate-700" },
  ];

  const stockGrid = [
    [18, 42, 0, 15],
    [24, 19, 31, 5],
    [9, 50, 12, 28],
  ];

  return (
    <div className="w-[85%] bg-white/90 backdrop-blur-md rounded-2xl border border-bz-blue/15 p-3.5 shadow-soft relative font-mono text-[9px] text-bz-navy select-none">
      {/* Variant matrix header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
        <span className="font-extrabold text-[8px] uppercase tracking-wider text-bz-blue">
          SKU Matrix Grid
        </span>
        <span className="text-[8px] bg-bz-blue-soft text-bz-blue px-1.5 py-0.5 rounded font-black">
          {hoveredCell !== null
            ? `${colors[hoveredCell.r].name} / ${sizes[hoveredCell.c]}`
            : "Hover Cells"}
        </span>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-5 gap-1.5 text-center items-center">
        {/* Empty top-left cell */}
        <span className="text-slate-400 font-bold">Size</span>
        {sizes.map((s, idx) => (
          <span
            key={s}
            className={`font-bold text-[9px] py-0.5 rounded transition ${
              hoveredCell?.c === idx
                ? "bg-bz-blue-soft text-bz-blue scale-110"
                : "text-slate-500"
            }`}
          >
            {s}
          </span>
        ))}

        {/* Rows */}
        {colors.map((color, rIdx) => (
          <div
            key={color.name}
            className="col-span-5 grid grid-cols-5 gap-1.5 items-center"
          >
            {/* Color identifier */}
            <div className="flex items-center gap-1">
              <span
                className={`size-2 rounded-full ${color.class} border border-slate-200/50 flex-shrink-0`}
              />
              <span
                className={`font-medium transition text-left ${
                  hoveredCell?.r === rIdx
                    ? "text-bz-blue font-bold"
                    : "text-slate-600"
                }`}
              >
                {color.name}
              </span>
            </div>

            {/* Matrix stock cells */}
            {stockGrid[rIdx].map((qty, cIdx) => (
              <span
                key={cIdx}
                onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                onMouseLeave={() => setHoveredCell(null)}
                className={`py-1 rounded font-bold transition-all duration-200 cursor-crosshair ${
                  qty === 0
                    ? "bg-rose-50 text-rose-500 border border-rose-100/50"
                    : hoveredCell?.r === rIdx && hoveredCell?.c === cIdx
                      ? "bg-bz-blue text-white shadow-sm scale-115"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                {qty}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Overlay tag */}
      <div className="absolute -bottom-3 -right-2 bg-slate-900 text-white rounded-lg p-1.5 shadow-lg border border-slate-800 rotate-3 flex items-center gap-1.5 transform scale-90">
        <div className="font-mono text-[7px] leading-tight pr-1.5 border-r border-slate-800">
          <span className="block font-bold">AP-POLO-M</span>
          <span className="text-[6px] text-slate-400">Barcode verified</span>
        </div>
        <div className="font-mono text-[8px] tracking-[2px] font-black text-slate-400 select-none">
          |||||
        </div>
      </div>
    </div>
  );
}

function JewelleryVisual() {
  const [scanned, setScanned] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setScanned(!scanned);
      }}
      className="w-[85%] bg-white/90 backdrop-blur-md rounded-2xl border border-bz-blue/15 p-3.5 shadow-soft relative overflow-hidden font-mono text-[9px] text-bz-navy cursor-pointer select-none"
    >
      {/* Animated Red Laser Scan Line */}
      <div className="absolute left-0 right-0 h-[1.5px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-[laser_3s_ease-in-out_infinite] z-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
        <span className="font-extrabold text-[8px] uppercase tracking-wider text-bz-blue">
          Design Spec Tag
        </span>
        <span
          className={`text-[8px] px-1.5 py-0.5 rounded font-black border transition-all ${
            scanned
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-amber-50 text-amber-600 border-amber-100"
          }`}
        >
          {scanned ? "VERIFIED (GRN)" : "PENDING SCAN"}
        </span>
      </div>

      {/* Visual content */}
      <div className="flex gap-3 items-center">
        {/* Jewelry Vector Illustration */}
        <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center relative flex-shrink-0">
          <svg
            className="size-8 text-amber-500 animate-[spin_12s_linear_infinite]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <circle
              cx="12"
              cy="5"
              r="3"
              fill="#2ec4b6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Spec labels */}
        <div className="space-y-0.5 flex-1 min-w-0">
          <div className="flex justify-between">
            <span className="text-slate-400">SKU</span>
            <span className="font-bold text-slate-800 truncate">
              JWL-R048-AU
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Weight</span>
            <span className="font-bold text-slate-800">5.84 g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Karat</span>
            <span className="font-bold text-slate-800">22K Gold</span>
          </div>
        </div>
      </div>

      {/* Barcode strip */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[7px] text-slate-400">BATCH: BZ-2026</span>
        <div className="flex flex-col items-end">
          <div className="h-4 w-16 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#1e293b_2px,#1e293b_4px)]" />
          <span className="text-[6px] text-slate-400 tracking-wider mt-0.5">
            *R048AU*
          </span>
        </div>
      </div>

      {/* Embedded Animation Keyframe Style */}
      <style jsx global>{`
        @keyframes laser {
          0%,
          100% {
            top: 10%;
          }
          50% {
            top: 90%;
          }
        }
      `}</style>
    </div>
  );
}

function FranchiseVisual() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const nodes = [
    { label: "DL-FL", name: "Delhi Store", revenue: "₹14.2L", fill: "84%" },
    { label: "MH-FL", name: "Mumbai Hub", revenue: "₹22.8L", fill: "96%" },
    { label: "BL-FL", name: "Bangalore", revenue: "₹9.5L", fill: "62%" },
  ];

  return (
    <div className="w-[85%] bg-white/90 backdrop-blur-md rounded-2xl border border-bz-blue/15 p-3.5 shadow-soft relative overflow-hidden font-mono text-[9px] text-bz-navy select-none">
      {/* Animation keyframes stylesheet */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <span className="font-extrabold text-[8px] uppercase tracking-wider text-bz-blue">
          Operating Lanes
        </span>
        <span className="text-[8px] font-bold text-slate-400">
          HQ Connected
        </span>
      </div>

      {/* Multi-node visualization */}
      <div className="grid grid-cols-7 gap-1 items-center relative">
        {/* Left Side: HQ node */}
        <div className="col-span-2 bg-bz-navy text-white rounded-xl p-2 text-center border border-slate-800 shadow-md z-10">
          <span className="text-[7px] text-slate-400 font-bold block uppercase tracking-wider">
            HQ
          </span>
          <span className="font-extrabold text-[10px] block mt-0.5">
            Control
          </span>
        </div>

        {/* Center: Dotted flow paths */}
        <div className="col-span-2 relative h-16 w-full flex items-center justify-center">
          <svg
            className="absolute w-full h-full overflow-visible"
            viewBox="0 0 60 60"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 30 Q 30 5 60 10"
              fill="none"
              stroke="#2f6bff"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              style={{ animation: "dash 1.5s linear infinite" }}
            />
            <path
              d="M 0 30 Q 30 30 60 30"
              fill="none"
              stroke="#2f6bff"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              style={{ animation: "dash 1.5s linear infinite" }}
            />
            <path
              d="M 0 30 Q 30 55 60 50"
              fill="none"
              stroke="#2f6bff"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              style={{ animation: "dash 1.5s linear infinite" }}
            />
          </svg>
        </div>

        {/* Right Side: Child store nodes */}
        <div className="col-span-3 space-y-1.5 z-10">
          {nodes.map((node, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveNode(idx)}
              onMouseLeave={() => setActiveNode(null)}
              className={`bg-white rounded-lg border p-1.5 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                activeNode === idx
                  ? "border-bz-blue bg-bz-blue-soft/30 scale-105"
                  : "border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center text-[7px] text-slate-500">
                <span className="font-bold">{node.label}</span>
                <span className="text-emerald-500 font-extrabold">
                  {node.fill}
                </span>
              </div>
              {activeNode === idx ? (
                <span className="text-[9px] font-bold text-slate-900 block mt-0.5">
                  {node.revenue}
                </span>
              ) : (
                <span className="text-[8px] text-slate-600 block mt-0.5 truncate">
                  {node.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Industry Section ---

const industryConfig = [
  {
    title: "Apparel & Footwear",
    body: "Variants, packs and sell-through across store and network.",
    href: "/industries/apparel-footwear",
    gradient: "from-[#DCE7FF] to-[#F6F8FF]",
    visual: ApparelVisual,
  },
  {
    title: "Imitation Jewellery",
    body: "Design-heavy pieces, fast POS and supplier receiving.",
    href: "/industries/imitation-jewellery",
    gradient: "from-[#DDF7F3] to-[#F4FCFA]",
    visual: JewelleryVisual,
  },
  {
    title: "Franchise Networks",
    body: "Central control with a clear operating lane for every partner.",
    href: "/industries/franchise-networks",
    gradient: "from-[#E6ECF4] to-[#F8FAFC]",
    visual: FranchiseVisual,
  },
];

export function IndustryBand() {
  return (
    <section className="section bg-slate-50 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent pointer-events-none" />

      <div className="shell relative z-10">
        <div className="max-w-2xl">
          <span className="eyebrow">Built around the merchandise</span>
          <h2 className="h2 mt-5">
            Operational depth for the way your category moves.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {industryConfig.map((item, i) => {
            const VisualComponent = item.visual;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group overflow-hidden rounded-[32px] border border-bz-border/70 bg-white hover:border-bz-blue/30 hover:shadow-soft transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Header Graphic Area */}
                <div
                  className={`blue-grid relative h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                >
                  <VisualComponent />
                  <span className="absolute left-5 top-5 text-[10px] font-extrabold uppercase tracking-[.16em] text-bz-blue/60 group-hover:text-bz-blue transition-colors duration-300">
                    0{i + 1}
                  </span>
                </div>

                {/* Content Details Area */}
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="h3 font-extrabold text-bz-navy group-hover:text-bz-blue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-bz-muted">
                      {item.body}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-bz-blue group-hover:text-bz-blue-hover transition-colors">
                    Explore industry{" "}
                    <ArrowRight
                      size={16}
                      className="transition duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
