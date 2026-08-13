const pillars = [
  {
    title: "Inventory",
    lead: "Know what exists and where.",
    items: [
      "Piece & series barcodes",
      "GRN, transfers and returns",
      "Audit, damage and adjustments",
    ],
  },
  {
    title: "Commerce",
    lead: "Sell from one product truth.",
    items: [
      "Retail POS and counters",
      "Wholesale billing & dispatch",
      "Ecommerce catalog and orders",
    ],
  },
  {
    title: "Network",
    lead: "Operate the brand and its partners.",
    items: [
      "Franchise allocation",
      "Entity-scoped workflows",
      "Central and local visibility",
    ],
  },
  {
    title: "Finance",
    lead: "Let books reflect operations.",
    items: [
      "COA, journals and ledgers",
      "AR/AP and receipts",
      "P&L, balance sheet and GST reports",
    ],
  },
];
export function CapabilityPillars() {
  return (
    <section className="section bg-bz-blue-soft">
      <div className="shell">
        <div className="max-w-2xl">
          <span className="eyebrow">Four capability pillars</span>
          <h2 className="h2 mt-5">
            Everything the network needs. Nothing detached from the workflow.
          </h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-bz-border bg-bz-border md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <article key={p.title} className="bg-white p-8">
              <span className="text-xs font-extrabold tracking-[.16em] text-bz-blue">
                0{i + 1}
              </span>
              <h3 className="h3 mt-7">{p.title}</h3>
              <p className="mt-3 text-sm text-bz-muted">{p.lead}</p>
              <ul className="mt-7 space-y-3">
                {p.items.map((x) => (
                  <li
                    key={x}
                    className="border-t border-bz-border pt-3 text-xs font-semibold text-bz-navy"
                  >
                    {x}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
