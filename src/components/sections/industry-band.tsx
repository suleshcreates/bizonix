import { ArrowRight } from "lucide-react";
import Link from "next/link";

const industries = [
  [
    "Apparel & Footwear",
    "Variants, packs and sell-through across store and network.",
    "/industries/apparel-footwear",
    "from-[#DCE7FF] to-[#F6F8FF]",
  ],
  [
    "Imitation Jewellery",
    "Design-heavy pieces, fast POS and supplier receiving.",
    "/industries/imitation-jewellery",
    "from-[#DDF7F3] to-[#F4FCFA]",
  ],
  [
    "Franchise Networks",
    "Central control with a clear operating lane for every partner.",
    "/industries/franchise-networks",
    "from-[#E6ECF4] to-[#F8FAFC]",
  ],
];
export function IndustryBand() {
  return (
    <section className="section bg-bz-surface-alt">
      <div className="shell">
        <div className="max-w-2xl">
          <span className="eyebrow">Built around the merchandise</span>
          <h2 className="h2 mt-5">
            Operational depth for the way your category moves.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {industries.map(([title, body, href, gradient], i) => (
            <Link
              key={title}
              href={href}
              className="group overflow-hidden rounded-[26px] border border-bz-border bg-white"
            >
              <div
                className={`blue-grid relative h-48 bg-gradient-to-br ${gradient}`}
              >
                <div
                  className={`absolute ${i === 1 ? "left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-3xl" : i === 2 ? "bottom-0 left-8 right-8 h-32 rounded-t-[80px]" : "bottom-0 right-6 h-36 w-40 rounded-tl-[80px]"} border border-bz-blue/20 bg-white/60 shadow-soft`}
                />
                <span className="absolute left-5 top-5 text-[10px] font-extrabold uppercase tracking-[.16em] text-bz-blue">
                  0{i + 1}
                </span>
              </div>
              <div className="p-7">
                <h3 className="h3">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-bz-muted">{body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-bz-blue">
                  Explore industry <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
