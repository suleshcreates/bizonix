"use client";
import { useState } from "react";
const moments = [
  {
    title: "Morning stock",
    kicker: "09:00 · Warehouse",
    body: "Review receiving, exceptions and availability before allocation begins.",
    steps: [
      "Confirm supplier GRNs",
      "Resolve barcode exceptions",
      "Release stock for stores and franchise",
    ],
  },
  {
    title: "Counter sale",
    kicker: "13:10 · Company retail",
    body: "Open a controlled billing session and sell against live piece identity.",
    steps: [
      "Assign counter session",
      "Scan item and apply price",
      "Post payment and stock movement",
    ],
  },
  {
    title: "Franchise transfer",
    kicker: "16:30 · Network",
    body: "Move the right stock to the right partner with visibility on both sides.",
    steps: [
      "Create source-to-destination transfer",
      "Receive against the same document",
      "Update entity stock visibility",
    ],
  },
  {
    title: "Month-end books",
    kicker: "18:00 · Finance",
    body: "Close with operational documents already carrying their financial context.",
    steps: [
      "Review journals and party ledgers",
      "Reconcile receipts and returns",
      "Read P&L and balance sheet",
    ],
  },
];
export function DayInLife() {
  const [active, setActive] = useState(0);
  const m = moments[active];
  return (
    <section className="section">
      <div className="shell">
        <span className="eyebrow">A day in the system</span>
        <h2 className="h2 mt-5 max-w-2xl">
          One operating rhythm, from opening stock to closing books.
        </h2>
        <div className="mt-12 grid overflow-hidden rounded-[30px] border border-bz-border lg:grid-cols-[.42fr_.58fr]">
          <div
            role="tablist"
            aria-label="Day in the life"
            className="bg-bz-surface-alt p-3"
          >
            {moments.map((x, i) => (
              <button
                type="button"
                role="tab"
                aria-selected={active === i}
                key={x.title}
                onClick={() => setActive(i)}
                className={`w-full rounded-2xl px-5 py-5 text-left transition ${active === i ? "bg-bz-navy text-white shadow-soft" : "hover:bg-white"}`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-[.14em] ${active === i ? "text-bz-teal" : "text-bz-muted"}`}
                >
                  {x.kicker}
                </span>
                <span className="mt-1 block font-bold">{x.title}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" className="p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-bz-blue">
              {m.kicker}
            </p>
            <h3 className="mt-4 text-3xl font-bold tracking-[-.045em]">
              {m.title}
            </h3>
            <p className="lede mt-5">{m.body}</p>
            <div className="mt-8 space-y-3">
              {m.steps.map((x, i) => (
                <div
                  key={x}
                  className="flex items-center gap-4 rounded-xl border border-bz-border px-4 py-3"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-bz-teal-soft text-xs font-bold text-bz-success">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold">{x}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
