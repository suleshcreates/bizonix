import { spine } from "@/lib/content/home";

export function PlatformSpine() {
  return (
    <section className="section overflow-hidden bg-bz-blue-soft">
      <div className="shell">
        <div className="max-w-3xl">
          <span className="eyebrow">The operating spine</span>
          <h2 className="h2 mt-5">
            Every movement carries its context forward.
          </h2>
          <p className="lede mt-5">
            From supplier receipt to financial statement, Bizonix keeps the same
            operational thread intact.
          </p>
        </div>
        <div className="relative mt-16 grid gap-0 lg:grid-cols-6">
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-bz-blue/25 lg:block" />
          {spine.map(([title, body], i) => (
            <article
              key={title}
              className="relative grid grid-cols-[40px_1fr] gap-5 border-l border-bz-blue/20 pb-9 pl-5 last:pb-0 lg:block lg:border-l-0 lg:pb-0 lg:pl-0 lg:pr-7"
            >
              <span className="relative z-10 flex size-10 items-center justify-center rounded-full border-4 border-bz-blue-soft bg-bz-blue text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="mt-1 text-base font-bold lg:mt-6">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-bz-muted">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
