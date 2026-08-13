import { ArrowRight, Boxes } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-bz-border bg-white">
      <div className="pointer-events-none absolute -right-40 top-10 size-[600px] rounded-full bg-bz-blue-soft blur-3xl" />
      <div className="shell relative grid min-h-[calc(100svh-80px)] items-center gap-12 py-16 lg:grid-cols-[.94fr_1.06fr] lg:py-20">
        <div className="reveal">
          <span className="eyebrow">ERP for multi-entity retail</span>
          <h1 className="display mt-7 max-w-[760px]">
            Wholesale, retail & franchise.{" "}
            <span className="text-bz-blue">One operating truth.</span>
          </h1>
          <p className="lede mt-7 max-w-2xl">
            Built for brands that run every channel as one business—not three
            disconnected tools. Bizonix connects the movement, sale and
            accounting behind each piece.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">
              Book a workflow demo <ArrowRight size={17} />
            </ButtonLink>
            <ButtonLink href="/modules" variant="secondary">
              Explore solutions
            </ButtonLink>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-bz-muted">
            <Link className="hover:text-bz-blue" href="#who-its-for">
              Running wholesale + retail? ↘
            </Link>
            <Link
              className="hover:text-bz-blue"
              href="/industries/franchise-networks"
            >
              Managing a franchise network? ↘
            </Link>
            <Link className="hover:text-bz-blue" href="#challenges">
              Still reconciling spreadsheets? ↘
            </Link>
          </div>
        </div>
        <InventoryVisual />
      </div>
    </section>
  );
}

function InventoryVisual() {
  const rows = [
    ["Classic Oxford Shirt", "Central warehouse", "184 pieces"],
    ["Tailored Chino", "Company retail", "96 pieces"],
    ["Linen Overshirt", "Franchise network", "72 pieces"],
    ["Essential Polo", "Ecommerce reserve", "128 pieces"],
  ];

  return (
    <div className="reveal relative lg:translate-x-10">
      <div className="absolute -left-8 top-10 h-[70%] w-3 rounded-full bg-bz-teal" />
      <div className="overflow-hidden rounded-[30px] border border-bz-border bg-white p-3 shadow-soft">
        <div className="rounded-[22px] border border-bz-border bg-bz-surface-alt">
          <div className="flex items-center justify-between border-b border-bz-border px-5 py-4">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-[#FF746C]" />
              <span className="size-2.5 rounded-full bg-[#F7C85C]" />
              <span className="size-2.5 rounded-full bg-bz-teal" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-bz-muted">
              Inventory overview
            </span>
            <span className="rounded-full border border-bz-border bg-white px-3 py-1 text-[10px] font-bold text-bz-muted">
              All entities
            </span>
          </div>
          <div className="grid min-h-[420px] grid-cols-[68px_1fr]">
            <aside className="border-r border-bz-border p-3" aria-hidden="true">
              <div className="mb-7 flex size-10 items-center justify-center rounded-xl bg-bz-navy text-white">
                <Boxes size={18} />
              </div>
              {[0, 1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`mx-auto mb-3 h-8 w-8 rounded-lg ${item === 1 ? "bg-bz-blue" : "border border-bz-border bg-white"}`}
                />
              ))}
            </aside>
            <div className="p-5 sm:p-7">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-bz-muted">
                    Piece-level availability
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-[-.04em]">
                    Stock across the network
                  </p>
                </div>
                <div className="hidden rounded-xl border border-bz-border bg-white px-3 py-2 text-xs font-bold text-bz-muted sm:block">
                  Updated today
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-bz-border bg-white">
                <div className="grid grid-cols-[1.35fr_1fr_auto] gap-3 border-b border-bz-border bg-bz-blue-soft/60 px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-bz-muted">
                  <span>Product</span>
                  <span>Context</span>
                  <span>Available</span>
                </div>
                {rows.map(([product, context, available]) => (
                  <div
                    className="grid grid-cols-[1.35fr_1fr_auto] items-center gap-3 border-b border-bz-border px-4 py-4 text-xs last:border-0"
                    key={product}
                  >
                    <span className="font-bold text-bz-navy">{product}</span>
                    <span className="text-bz-muted">{context}</span>
                    <span className="font-semibold text-bz-navy">
                      {available}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-bz-blue-soft px-4 py-3">
                <p className="text-xs font-semibold text-bz-navy">
                  The same piece context follows every movement and sale.
                </p>
                <ArrowRight className="shrink-0 text-bz-blue" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
