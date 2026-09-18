import Link from "next/link";
export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <section className="section">
      <div className="shell max-w-3xl">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
          DRAFT — pending legal review before public launch
        </div>
        <h1 className="display mt-10">{title}</h1>
        <p className="lede mt-6">
          This page provides the Phase 1 legal structure only. It is not final
          legal advice or production-approved policy.
        </p>
        <div className="mt-12 space-y-10">
          {sections.map((x) => (
            <section key={x.heading}>
              <h2 className="text-2xl font-bold tracking-[-.035em]">
                {x.heading}
              </h2>
              <p className="mt-3 leading-8 text-bz-muted">{x.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 border-t border-bz-border pt-8 text-sm text-bz-muted">
          Questions about this draft?{" "}
          <Link className="font-bold text-bz-blue" href="/contact">
            Contact Fibonce
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
