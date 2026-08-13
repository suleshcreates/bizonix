import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { audiences } from "@/lib/content/home";

export function AudienceSection() {
  return (
    <section id="who-its-for" className="section">
      <div className="shell">
        <div className="max-w-2xl">
          <span className="eyebrow">One system, three operating realities</span>
          <h2 className="h2 mt-5">
            Made for the whole network—not just head office.
          </h2>
        </div>
        <div className="mt-14 grid border-y border-bz-border md:grid-cols-3">
          {audiences.map((item, i) => (
            <Link
              href="/industries"
              key={item.title}
              className={`group py-9 md:px-9 ${i > 0 ? "border-t border-bz-border md:border-l md:border-t-0" : ""}`}
            >
              <item.icon
                className="text-bz-blue transition group-hover:-translate-y-1"
                size={30}
              />
              <h3 className="h3 mt-7">{item.title}</h3>
              <p className="mt-4 text-bz-muted">{item.body}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-bz-blue">
                See the fit <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
