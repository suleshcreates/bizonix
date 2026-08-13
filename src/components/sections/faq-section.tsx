import { Plus } from "lucide-react";
import { faqs } from "@/lib/content/home";

export function FAQSection() {
  return (
    <section className="section">
      <div className="shell grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <span className="eyebrow">Straight answers</span>
          <h2 className="h2 mt-5">Before you see it on your workflow.</h2>
          <p className="lede mt-6">
            A practical starting point. The demo is where we map Bizonix to your
            entities, merchandise and controls.
          </p>
        </div>
        <div className="border-t border-bz-border">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-b border-bz-border py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold">
                <span>{q}</span>
                <Plus
                  className="shrink-0 text-bz-blue transition group-open:rotate-45"
                  size={20}
                />
              </summary>
              <p className="max-w-3xl pr-10 pt-4 text-sm leading-7 text-bz-muted">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
