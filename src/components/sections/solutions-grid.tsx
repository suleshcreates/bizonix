import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { modules } from "@/lib/content/home";

export function SolutionsGrid() {
  return (
    <section className="section">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">Complete where it matters</span>
            <h2 className="h2 mt-5">
              The modules a multi-entity brand actually needs.
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 font-bold text-bz-blue"
            href="/modules"
          >
            View all solutions <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-bz-border bg-bz-border md:grid-cols-2 lg:grid-cols-3">
          {modules.map((item) => (
            <Link
              key={item.slug}
              href={`/modules/${item.slug}`}
              className="group bg-white p-8 transition hover:bg-bz-blue-soft"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-bz-surface-alt text-bz-blue group-hover:bg-white">
                  <item.icon size={22} />
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-bz-muted transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-bz-blue"
                />
              </div>
              <h3 className="h3 mt-8">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-bz-muted">
                {item.body}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
