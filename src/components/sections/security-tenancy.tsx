import { Eye, KeyRound, ShieldCheck } from "lucide-react";
const items = [
  [
    KeyRound,
    "Roles match responsibility",
    "Shape access around what a warehouse, counter, franchise or finance user must do.",
  ],
  [
    Eye,
    "Entity scope stays explicit",
    "Keep branch and partner visibility focused while allowing central oversight.",
  ],
  [
    ShieldCheck,
    "Audit-minded operations",
    "Preserve who did what, where and against which operational document.",
  ],
];
export function SecurityTenancy() {
  return (
    <section className="section bg-bz-navy text-white">
      <div className="shell grid gap-14 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <span className="eyebrow !text-bz-teal">Security & tenancy</span>
          <h2 className="h2 mt-5">
            Access designed around the operating model.
          </h2>
          <p className="mt-6 max-w-lg text-white/62">
            Bizonix applies roles and entity scope to real operational
            responsibility. No unconfirmed certification claims—just precise
            access architecture.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map(([Icon, title, body]) => (
            <article
              key={String(title)}
              className="rounded-2xl border border-white/12 bg-white/[.04] p-6"
            >
              <Icon className="text-bz-teal" size={24} />
              <h3 className="mt-6 font-bold">{String(title)}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">
                {String(body)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
