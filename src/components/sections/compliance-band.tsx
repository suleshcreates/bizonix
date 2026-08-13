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
      <div className="shell grid py-12 md:grid-cols-2 lg:grid-cols-4">
        {items.map(([Icon, title, body], i) => (
          <article
            key={title}
            className={`py-5 md:px-7 ${i ? "md:border-l md:border-bz-teal/20" : ""}`}
          >
            <Icon className="text-bz-success" size={25} />
            <h2 className="mt-5 font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-bz-muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
