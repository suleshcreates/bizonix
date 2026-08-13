import { Check } from "lucide-react";
import { trustPoints } from "@/lib/content/home";

export function TrustStrip() {
  return (
    <section
      aria-label="Bizonix proof points"
      className="border-b border-bz-border bg-bz-surface-alt"
    >
      <div className="shell grid md:grid-cols-2 lg:grid-cols-4">
        {trustPoints.map((item, index) => (
          <article
            key={item.title}
            className={`py-7 md:px-7 ${index > 0 ? "border-t border-bz-border md:border-t-0 md:border-l" : ""}`}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-bz-teal-soft text-bz-success">
                <Check size={14} strokeWidth={3} />
              </span>
              <h2 className="text-sm font-bold">{item.title}</h2>
            </div>
            <p className="mt-3 text-xs leading-6 text-bz-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
