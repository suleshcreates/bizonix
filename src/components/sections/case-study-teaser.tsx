import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function CaseStudyTeaser() {
  const outcomes = [
    "Gave teams a shared view of piece-level stock as it moved between warehouse, retail and franchise operations.",
    "Kept billing, returns and receipts connected to the operating entity that created them.",
    "Replaced fragmented follow-up with one workflow from receiving through books.",
  ];
  return (
    <section className="section">
      <div className="shell overflow-hidden rounded-[32px] bg-bz-navy text-white">
        <div className="grid lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-72 overflow-hidden bg-bz-blue p-10 md:p-14">
            <div className="blue-grid absolute inset-0 opacity-40" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-white/65">
                Flagship deployment
              </p>
              <p className="mt-8 text-5xl font-extrabold tracking-[-.06em] md:text-7xl">
                Pratyush
              </p>
              <p className="mt-6 max-w-sm text-white/72">
                A live operating environment spanning warehouse, jewellery
                retail, franchise, accounting and ecommerce workflows.
              </p>
            </div>
          </div>
          <div className="p-10 md:p-14">
            <span className="eyebrow !text-bz-teal">
              Proof through operational depth
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-[-.045em] md:text-4xl">
              One deployment. The whole operating chain.
            </h2>
            <ul className="mt-8 space-y-5">
              {outcomes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-7 text-white/68"
                >
                  <CheckCircle2
                    className="mt-1 shrink-0 text-bz-teal"
                    size={19}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              className="mt-9 inline-flex items-center gap-2 font-bold text-white"
              href="/case-studies/pratyush"
            >
              Read the full case study <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
