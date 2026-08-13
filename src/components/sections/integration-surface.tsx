import { MessageCircle, PanelsTopLeft, PlugZap } from "lucide-react";
export function IntegrationSurface() {
  return (
    <section className="section">
      <div className="shell">
        <div className="max-w-2xl">
          <span className="eyebrow">Integration surface</span>
          <h2 className="h2 mt-5">
            Connected where the workflow is real. Honest where it is next.
          </h2>
        </div>
        <div className="mt-12 grid border-y border-bz-border md:grid-cols-3">
          {[
            [
              PanelsTopLeft,
              "Ecommerce",
              "Catalog, order, CMS and storefront capabilities inside the product surface.",
            ],
            [
              MessageCircle,
              "WhatsApp sharing",
              "Share invoice context through the channel customers already use.",
            ],
            [
              PlugZap,
              "APIs",
              "A future integration surface—not represented as generally available today.",
            ],
          ].map(([Icon, title, body], i) => (
            <article
              key={String(title)}
              className={`py-9 md:px-8 ${i ? "border-t border-bz-border md:border-l md:border-t-0" : ""}`}
            >
              <Icon className="text-bz-blue" size={27} />
              <h3 className="h3 mt-6">{String(title)}</h3>
              <p className="mt-3 text-sm leading-7 text-bz-muted">
                {String(body)}
              </p>
              {i === 2 && (
                <span className="mt-5 inline-block rounded-full bg-bz-blue-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-bz-blue">
                  Coming soon
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
