import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { DemoForm } from "@/components/sections/demo-form";
import { siteConfig } from "@/lib/site-config";
export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "See Bizonix ERP on your wholesale, retail and franchise workflows.",
  openGraph: {
    title: "See Bizonix on your workflows",
    description: "Book a practical workflow demo with the Bizonix team.",
  },
};
export default function ContactPage() {
  return (
    <section className="section bg-bz-surface-alt">
      <div className="shell grid gap-14 lg:grid-cols-[.78fr_1.22fr]">
        <div>
          <span className="eyebrow">Book a demo</span>
          <h1 className="display mt-6">
            See Bizonix on <span className="text-bz-blue">your workflows.</span>
          </h1>
          <p className="lede mt-7">
            Tell us how your warehouse, stores and franchise network operate.
            We’ll make the conversation specific.
          </p>
          <div className="mt-10 space-y-4 border-t border-bz-border pt-8">
            <Contact
              icon={MessageCircle}
              label="WhatsApp"
              value="Open a conversation"
              href={siteConfig.whatsappUrl}
            />
            <Contact
              icon={Mail}
              label="Email"
              value={siteConfig.salesEmail}
              href={`mailto:${siteConfig.salesEmail}`}
            />
            <Contact
              icon={Phone}
              label="Phone"
              value={siteConfig.salesPhone}
              href="#"
            />
          </div>
          <p className="mt-9 rounded-xl bg-bz-teal-soft px-4 py-3 text-sm font-bold text-bz-success">
            We’ll respond within 1 business day.
          </p>
        </div>
        <DemoForm />
      </div>
    </section>
  );
}
function Contact({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 rounded-xl p-2 hover:bg-white"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-bz-blue-soft text-bz-blue">
        <Icon size={19} />
      </span>
      <span>
        <span className="block text-[10px] font-bold uppercase tracking-wider text-bz-muted">
          {label}
        </span>
        <span className="text-sm font-bold">{value}</span>
      </span>
    </a>
  );
}
