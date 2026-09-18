import {
  BookOpenCheck,
  FileCheck2,
  ReceiptIndianRupee,
  Tags,
} from "lucide-react";

const items = [
  [
    ReceiptIndianRupee,
    "GST-ready invoices",
    "Carry party and tax context into the document at billing.",
  ],
  [
    BookOpenCheck,
    "Party ledgers",
    "Keep receivables, payables and receipts close to the transaction.",
  ],
  [
    Tags,
    "Series control",
    "Apply purchase and selling rates with deliberate commercial discipline.",
  ],
  [
    FileCheck2,
    "Document trail",
    "Follow transfers, returns and adjustments without losing the why.",
  ],
] as const;
export function ComplianceBand() {
  return (
    <section className="border-y border-bz-border bg-bz-teal-soft/60">
      <div className="shell grid py-10 md:grid-cols-2 md:py-12 lg:grid-cols-4">
        {items.map(([Icon, title, body], i) => (
          <article
            key={title}
            /* Stacked on a phone the four claims ran together as one block of
               text; a hairline between them restores the column rule the
               desktop layout gets from its borders. */
            className={`flex gap-4 py-5 md:block md:px-7 ${
              i ? "border-t border-bz-teal/20 md:border-l md:border-t-0" : ""
            }`}
          >
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-bz-success md:mt-0 md:size-auto md:rounded-none md:bg-transparent">
              <Icon size={25} />
            </span>
            <div>
              <h2 className="font-bold md:mt-5">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-bz-muted">{body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
