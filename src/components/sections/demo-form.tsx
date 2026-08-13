"use client";
import { ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/site-config";

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  industry: string;
  companySize: string;
  message: string;
  consent: boolean;
  website: string;
};
const initial: FormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  city: "",
  industry: "",
  companySize: "",
  message: "",
  consent: false,
  website: "",
};
export function DemoForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const update = (key: keyof FormState, value: string | boolean) =>
    setForm((p) => ({ ...p, [key]: value }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (
      !form.name.trim() ||
      !form.company.trim() ||
      !/^[+\d][\d\s-]{7,17}$/.test(form.phone) ||
      !form.consent
    ) {
      setError(
        "Please complete the required fields and enter a valid phone number.",
      );
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "We couldn't send your request.");
      setStatus("success");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "We couldn't send your request.",
      );
      setStatus("error");
    }
  }
  if (status === "success")
    return (
      <div
        className="rounded-[28px] border border-bz-border bg-white p-8 shadow-soft md:p-10"
        role="status"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-bz-teal-soft text-bz-success">
          <CheckCircle2 />
        </span>
        <h2 className="mt-6 text-3xl font-bold tracking-[-.04em]">
          Your workflow is on our radar.
        </h2>
        <p className="mt-4 text-bz-muted">
          Thanks, {form.name}. The Bizonix team will review your details and
          respond within one business day.
        </p>
        <a
          href={siteConfig.whatsappUrl}
          className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-bz-blue px-6 text-sm font-bold text-white"
        >
          <MessageCircle size={18} /> Continue on WhatsApp
        </a>
        {siteConfig.calendlyUrl ? (
          <a
            href={siteConfig.calendlyUrl}
            className="mt-4 block text-sm font-bold text-bz-blue"
          >
            Choose a Calendly time →
          </a>
        ) : (
          <p className="mt-5 text-xs text-bz-muted">
            Calendar booking will be added in Phase 3.
          </p>
        )}
      </div>
    );
  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-[28px] border border-bz-border bg-white p-6 shadow-soft md:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          required
          value={form.name}
          onChange={(v) => update("name", v)}
        />
        <Field
          label="Company"
          required
          value={form.company}
          onChange={(v) => update("company", v)}
        />
        <Field
          label="Phone"
          required
          type="tel"
          value={form.phone}
          onChange={(v) => update("phone", v)}
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
        />
        <Field
          label="City"
          value={form.city}
          onChange={(v) => update("city", v)}
        />
        <Select
          label="Industry"
          value={form.industry}
          onChange={(v) => update("industry", v)}
          options={[
            "Apparel & Footwear",
            "Imitation Jewellery",
            "Franchise Networks",
            "Other",
          ]}
        />
        <Select
          label="Company size"
          value={form.companySize}
          onChange={(v) => update("companySize", v)}
          options={["1–10", "11–50", "51–200", "200+"]}
        />
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-2 block text-sm font-bold">
            What should we understand about your operation?
          </label>
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={4}
            className="w-full resize-y rounded-xl border border-bz-border px-4 py-3 text-sm transition focus:border-bz-blue"
            placeholder="Warehouses, stores, franchise outlets, current tools…"
          />
        </div>
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>
      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-bz-muted">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1 size-4 accent-bz-blue"
        />
        <span>
          I agree to be contacted about Bizonix.{" "}
          <strong className="text-bz-navy">Required.</strong>
        </span>
      </label>
      {error && (
        <p
          className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-bz-danger"
          role="alert"
        >
          {error}
        </p>
      )}
      <button
        disabled={status === "loading"}
        className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-bz-blue px-7 text-sm font-bold text-white transition hover:bg-bz-blue-hover disabled:opacity-65"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Sending…
          </>
        ) : (
          <>
            Request my demo <ArrowRight size={17} />
          </>
        )}
      </button>
    </form>
  );
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
        {label}
        {required && <span className="text-bz-blue"> *</span>}
      </label>
      <input
        id={id}
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-bz-border px-4 text-sm transition focus:border-bz-blue"
      />
    </div>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-bz-border bg-white px-4 text-sm"
      >
        <option value="">Select an option</option>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </div>
  );
}
