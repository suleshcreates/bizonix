"use client";

import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stockRows = [
  ["BX-4021", "Thermal Roll 80mm", "HQ", "12,480", "Healthy"],
  ["BX-7734", "Cold Chain Crate", "Retail", "2,140", "Reorder"],
  ["BX-1188", "Pallet Wrap Pro", "Franchise", "6,902", "Healthy"],
  ["BX-9052", "POS Terminal S2", "Retail", "318", "Low"],
] as const;

const kpis = [
  ["Net revenue", "₹8.1L", "+8.4%", "vs. prior quarter", "up"],
  ["Gross margin", "31.6%", "+1.2 pts", "blended, 4 entities", "up"],
  ["Stock cover", "38 days", "-3 days", "network average", "down"],
] as const;

export function DashboardShowcase({ layered = true }: { layered?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (reduced.matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(element);

    if (!finePointer.matches) return () => observer.disconnect();

    const onMove = (event: PointerEvent) => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        element.style.setProperty("--bz-x", `${x * 18}px`);
        element.style.setProperty("--bz-y", `${y * 11}px`);
        element.style.setProperty("--bz-rx", `${y * 1.6}deg`);
        element.style.setProperty("--bz-ry", `${x * -2.2}deg`);
        frameRef.current = null;
      });
    };

    const onLeave = () => {
      element.style.setProperty("--bz-x", "0px");
      element.style.setProperty("--bz-y", "0px");
      element.style.setProperty("--bz-rx", "0deg");
      element.style.setProperty("--bz-ry", "0deg");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div ref={ref} className={`bz-showcase ${entered ? "is-entered" : ""}`}>
      {layered && <StockPanel />}
      <DashboardPanel />
      <div className="bz-showcase-shadow" aria-hidden="true" />
    </div>
  );
}

function DashboardPanel() {
  return (
    <section
      className="bz-panel bz-dashboard"
      aria-label="Illustrative branch performance dashboard"
    >
      <div className="bz-browser-bar">
        <div className="bz-browser-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="bz-browser-address">
          <i /> bizonix.app/analytics/branch-performance
        </div>
        <span>Q3 · FY26</span>
      </div>

      <div className="bz-dashboard-body">
        <div className="bz-dashboard-heading">
          <div>
            <h2>Branch Performance</h2>
            <p>12 branches · 4 legal entities · consolidated view</p>
          </div>
          <div className="bz-periods">
            <span>Week</span>
            <strong>Quarter</strong>
            <span>Year</span>
          </div>
        </div>

        <div className="bz-kpis">
          {kpis.map(([label, value, delta, note, direction]) => (
            <article key={label}>
              <small>{label}</small>
              <div>
                <strong>{value}</strong>
                <span className={direction}>
                  {direction === "up" ? (
                    <ArrowUpRight size={11} />
                  ) : (
                    <ArrowDownRight size={11} />
                  )}
                  {delta}
                </span>
              </div>
              <p>{note}</p>
            </article>
          ))}
        </div>

        <div className="bz-chart-card">
          <div className="bz-chart-heading">
            <strong>Sales trend · all entities</strong>
            <span>
              <i /> Actual
            </span>
            <span>
              <i /> Plan
            </span>
          </div>
          <TrendChart />
          <div className="bz-chart-weeks">
            <span>W27</span>
            <span>W32</span>
            <span>W37</span>
            <span>W42</span>
            <span>W46</span>
          </div>
        </div>

        <div className="bz-reconciled">
          <Check size={13} /> Ledger reconciled across all entities ·
          illustrative data
        </div>
      </div>
    </section>
  );
}

function TrendChart() {
  return (
    <svg
      className="bz-trend-chart"
      viewBox="0 0 640 168"
      preserveAspectRatio="none"
      role="img"
      aria-label="Illustrative sales trend across entities"
    >
      <defs>
        <linearGradient id="bz-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f6bff" stopOpacity=".22" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="bz-grid-lines" d="M0 42H640M0 84H640M0 126H640" />
      <path
        className="bz-area"
        d="M0 139L34 124L68 133L102 112L136 101L170 110L204 86L238 75L272 84L306 63L340 50L374 61L408 39L442 27L476 38L510 19L544 10L578 20L612 2L640 0V168H0Z"
      />
      <path
        className="bz-plan"
        d="M0 145L34 130L68 137L102 118L136 107L170 116L204 94L238 84L272 92L306 72L340 61L374 70L408 50L442 39L476 49L510 32L544 23L578 31L612 14L640 9"
      />
      <path
        className="bz-actual"
        pathLength="1"
        d="M0 139L34 124L68 133L102 112L136 101L170 110L204 86L238 75L272 84L306 63L340 50L374 61L408 39L442 27L476 38L510 19L544 10L578 20L612 2L640 0"
      />
    </svg>
  );
}

function StockPanel() {
  return (
    <section
      className="bz-panel bz-stock"
      aria-label="Illustrative stock overview"
    >
      <header>
        <div>
          <h2>Stock Overview</h2>
          <p>Across 3 warehouses</p>
        </div>
        <span>live</span>
      </header>
      <div className="bz-stock-table" role="table">
        <div className="bz-stock-row bz-stock-head" role="row">
          <span>SKU</span>
          <span>Entity</span>
          <span>Qty</span>
          <span>Status</span>
        </div>
        {stockRows.map(([sku, name, entity, quantity, status]) => (
          <div className="bz-stock-row" role="row" key={sku}>
            <span>
              <strong>{sku}</strong>
              <small>{name}</small>
            </span>
            <span>{entity}</span>
            <span>{quantity}</span>
            <span data-tone={status.toLowerCase()}>{status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
