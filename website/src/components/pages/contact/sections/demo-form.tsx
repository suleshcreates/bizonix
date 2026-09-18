"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  MAX_PRIORITIES,
  priorityOptions,
  roleOptions,
  timelineOptions,
} from "@/lib/content/contact/contact-content";
import { readUtmParams, track } from "@/lib/analytics";
import { hasSalesEmail, siteConfig } from "@/lib/site-config";
import styles from "@/components/pages/contact/contact.module.css";

export type FormValues = {
  fullName: string;
  companyName: string;
  city: string;
  outletCount: string;
  currentSoftware: string;
  role: string;
  priorities: string[];
  timeline: string;
  email: string;
  phone: string;
  notes: string;
  consent: boolean;
  website: string;
};

const EMPTY: FormValues = {
  fullName: "",
  companyName: "",
  city: "",
  outletCount: "",
  currentSoftware: "",
  role: "",
  priorities: [],
  timeline: "",
  email: "",
  phone: "",
  notes: "",
  consent: false,
  website: "",
};

const STORAGE_KEY = "bz_demo_form";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s-]{7,17}$/;

type FieldName = keyof Omit<FormValues, "website">;

const noopSubscribe = () => () => {};

/**
 * The draft and any CRM prefill live outside React (sessionStorage and the
 * URL), so they are read through an external-store snapshot rather than a
 * setState-in-effect. The snapshot is frozen on first read: React owns the
 * values from then on, and a stable reference keeps re-renders from cascading.
 */
let initialSnapshot: FormValues | null = null;

function readInitialValues(): FormValues {
  if (initialSnapshot) return initialSnapshot;
  let draft: Partial<FormValues> = {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) draft = JSON.parse(raw) as Partial<FormValues>;
  } catch {
    // Private-mode storage failures are not worth surfacing.
  }
  const params = new URLSearchParams(window.location.search);
  const company = params.get("company");
  const email = params.get("email");
  initialSnapshot = {
    ...EMPTY,
    ...draft,
    ...(company ? { companyName: company.slice(0, 160) } : {}),
    ...(email ? { email: email.slice(0, 160) } : {}),
    // Consent is always an active choice, never restored.
    consent: false,
    website: "",
  };
  return initialSnapshot;
}

const readServerValues = () => EMPTY;

/** Called after a successful submit so a remount does not restore a sent draft. */
const clearInitialSnapshot = () => {
  initialSnapshot = null;
};

/** Module scope keeps these out of the render-purity checks. */
const elapsedSince = (start: number) => Date.now() - start;
const currentUtm = () =>
  readUtmParams(new URLSearchParams(window.location.search));

function validate(values: FormValues): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.fullName.trim()) errors.fullName = "Tell us your name.";
  if (!values.companyName.trim())
    errors.companyName = "Tell us which business this is for.";
  if (!values.role) errors.role = "Choose the closest match to your role.";
  if (!values.city.trim()) errors.city = "Tell us your city.";
  if (!values.outletCount.trim())
    errors.outletCount = "Tell us how many outlets you operate.";
  if (!values.currentSoftware.trim())
    errors.currentSoftware = "Tell us what you use today.";
  if (values.priorities.length === 0)
    errors.priorities = "Pick at least one priority.";
  if (!values.timeline) errors.timeline = "Let us know roughly when.";
  if (!values.email.trim())
    errors.email = "We need an email to send the invite.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!values.phone.trim())
    errors.phone = "We need a phone number to contact you.";
  else if (!PHONE_RE.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number.";
  if (!values.consent)
    errors.consent = "We need your agreement before we can contact you.";
  return errors;
}

export function DemoForm({
  onSuccess,
}: {
  onSuccess: (values: FormValues) => void;
}) {
  const initial = useSyncExternalStore(
    noopSubscribe,
    readInitialValues,
    readServerValues,
  );
  const [edits, setEdits] = useState<FormValues | null>(null);
  const values = edits ?? initial;
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [failures, setFailures] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  const engaged = useRef<Set<string>>(new Set());

  const setValues = (next: (current: FormValues) => FormValues) =>
    setEdits((current) => next(current ?? initial));

  const errors = validate(values);
  const complete = Object.keys(errors).length === 0;
  const firstStepFields: FieldName[] = ["fullName", "companyName", "role", "city", "outletCount", "currentSoftware"];

  function nextStep() {
    const first = firstStepFields.find((field) => errors[field]);
    if (first) {
      setTouched((current) => ({ ...current, ...Object.fromEntries(firstStepFields.map((field) => [field, true])) }));
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setFormStep(1);
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>("[name=priorities]")?.focus({ preventScroll: true });
      if (window.innerWidth < 801) formRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  }

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    try {
      const { consent, website, ...rest } = values;
      void consent;
      void website;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      // Persistence is best-effort.
    }
  }, [values]);

  const set = <K extends FieldName>(key: K, value: FormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const engage = (field: FieldName) => {
    if (engaged.current.has(field)) return;
    engaged.current.add(field);
    track("contact_field_engaged", { field, position: engaged.current.size });
  };

  const leave = (field: FieldName, isEmpty: boolean) => {
    setTouched((current) => ({ ...current, [field]: true }));
    if (isEmpty) track("contact_field_abandoned", { field });
  };

  const togglePriority = (value: string) => {
    engage("priorities");
    setTouched((current) => ({ ...current, priorities: true }));
    setValues((current) => {
      const selected = current.priorities.includes(value);
      if (selected)
        return {
          ...current,
          priorities: current.priorities.filter((p) => p !== value),
        };
      if (current.priorities.length >= MAX_PRIORITIES) return current;
      return { ...current, priorities: [...current.priorities, value] };
    });
  };

  const focusFirstError = () => {
    const order: FieldName[] = [
      "fullName",
      "companyName",
      "role",
      "city",
      "outletCount",
      "currentSoftware",
      "priorities",
      "timeline",
      "email",
      "phone",
      "consent",
    ];
    const first = order.find((field) => errors[field]);
    if (!first) return;
    setTouched(Object.fromEntries(order.map((field) => [field, true])));
    const node = formRef.current?.querySelector<HTMLElement>(
      `[data-field="${first}"]`,
    );
    node?.focus();
    node?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (formStep === 0) { nextStep(); return; }
    if (status === "loading") return;
    setSubmitError("");
    if (!complete) {
      focusFirstError();
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          email: values.email.trim(),
          companyName: values.companyName.trim(),
          elapsedMs: elapsedSince(startedAt.current),
          utm: currentUtm(),
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        priority?: string;
      };
      if (!response.ok)
        throw new Error(data.error || "We couldn't send your request.");
      track("contact_form_submitted", {
        role: values.role,
        timeline: values.timeline,
        priorities: values.priorities,
      });
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing to clean up if storage is unavailable.
      }
      clearInitialSnapshot();
      onSuccess(values);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't send your request.";
      setFailures((count) => count + 1);
      setSubmitError(message);
      setStatus("error");
      track("contact_form_failed", { message });
    }
  }

  const err = (field: FieldName) =>
    touched[field] ? errors[field] : undefined;
  const timeline = timelineOptions.find(
    (option) => option.value === values.timeline,
  );

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className={styles.contact__form}
    >
      <div className={styles.contact__formHead}>
        <div className={styles.studioFormProgress} aria-label={`Step ${formStep + 1} of 2`}>
          <span data-current={formStep === 0}><b>01</b> Your operation</span>
          <i />
          <span data-current={formStep === 1}><b>02</b> Your session</span>
        </div>
        <h2 id="demo-form-title">{formStep === 0 ? "Let’s make it your demo." : "What should we explore?"}</h2>
        <p>{formStep === 0 ? "Start with the business behind the request." : "Choose your priorities and how we can reach you."}</p>
      </div>

      <div className={styles.contact__fields} hidden={formStep !== 0}>
        <Field
          name="fullName"
          label="Full name"
          placeholder="Your name"
          value={values.fullName}
          error={err("fullName")}
          onChange={(value) => set("fullName", value)}
          onFocus={() => engage("fullName")}
          onBlur={() => leave("fullName", !values.fullName.trim())}
          autoComplete="name"
        />
        <Field
          name="companyName"
          label="Company name"
          placeholder="Your business name"
          value={values.companyName}
          error={err("companyName")}
          onChange={(value) => set("companyName", value)}
          onFocus={() => engage("companyName")}
          onBlur={() => leave("companyName", !values.companyName.trim())}
          autoComplete="organization"
        />
        <div className={styles.contact__field}>
          <label htmlFor="role">
            Your role <span aria-hidden="true">*</span>
          </label>
          <div className={styles.contact__selectWrap}>
            <select
              id="role"
              data-field="role"
              value={values.role}
              aria-invalid={err("role") ? true : undefined}
              aria-describedby={err("role") ? "role-error" : undefined}
              onFocus={() => engage("role")}
              onBlur={() => leave("role", !values.role)}
              onChange={(event) => set("role", event.target.value)}
            >
              <option value="">Select your role</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
          <FieldError id="role-error" message={err("role")} />
        </div>
        <Field
          name="city"
          label="City"
          placeholder="e.g. Mumbai"
          value={values.city}
          error={err("city")}
          onChange={(value) => set("city", value)}
          onFocus={() => engage("city")}
          onBlur={() => leave("city", !values.city.trim())}
          autoComplete="address-level2"
        />
        <Field
          name="outletCount"
          label="Outlet count"
          placeholder="e.g. 12"
          value={values.outletCount}
          error={err("outletCount")}
          onChange={(value) => set("outletCount", value)}
          onFocus={() => engage("outletCount")}
          onBlur={() => leave("outletCount", !values.outletCount.trim())}
        />
        <Field
          name="currentSoftware"
          label="Current software"
          placeholder="e.g. Tally, Excel, Retail POS"
          value={values.currentSoftware}
          error={err("currentSoftware")}
          onChange={(value) => set("currentSoftware", value)}
          onFocus={() => engage("currentSoftware")}
          onBlur={() =>
            leave("currentSoftware", !values.currentSoftware.trim())
          }
        />
      </div>

      {formStep === 0 && <div className={styles.studioNext}>
        <button type="submit" className={styles.contact__submit}>Shape my session <ArrowRight size={17} aria-hidden="true" /></button>
        <p>Your details stay here while you move between steps.</p>
      </div>}
      <div className={styles.contact__unlocked} hidden={formStep !== 1}>
        <button type="button" className={styles.studioBack} onClick={() => setFormStep(0)}>← Edit your operation</button>
        <fieldset
          className={styles.contact__fieldset}
          aria-describedby={
            err("priorities") ? "priorities-error" : "priorities-hint"
          }
        >
          <legend>
            Biggest priority <span aria-hidden="true">*</span>
          </legend>
          <p id="priorities-hint" className={styles.contact__hint}>
            Pick up to {MAX_PRIORITIES}. We build the session around these.
          </p>
          <div className={styles.contact__choices}>
            {priorityOptions.map((option, index) => {
              const selected = values.priorities.includes(option.value);
              const full =
                values.priorities.length >= MAX_PRIORITIES && !selected;
              return (
                <label
                  key={option.value}
                  className={`${styles.contact__choice} ${selected ? styles.contact__choiceOn : ""} ${
                    full ? styles.contact__choiceOff : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="priorities"
                    value={option.value}
                    checked={selected}
                    disabled={full}
                    data-field={index === 0 ? "priorities" : undefined}
                    onChange={() => togglePriority(option.value)}
                  />
                  <span className={styles.contact__tick} aria-hidden="true">
                    <Check size={12} strokeWidth={3.2} />
                  </span>
                  {option.label}
                </label>
              );
            })}
          </div>
          <FieldError id="priorities-error" message={err("priorities")} />
        </fieldset>

        <fieldset
          className={styles.contact__fieldset}
          aria-describedby={err("timeline") ? "timeline-error" : undefined}
        >
          <legend>
            When are you looking to move? <span aria-hidden="true">*</span>
          </legend>
          <div className={styles.contact__radios}>
            {timelineOptions.map((option, index) => (
              <label
                key={option.value}
                className={`${styles.contact__radio} ${
                  values.timeline === option.value
                    ? styles.contact__radioOn
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="timeline"
                  value={option.value}
                  checked={values.timeline === option.value}
                  data-field={index === 0 ? "timeline" : undefined}
                  onChange={() => {
                    engage("timeline");
                    setTouched((current) => ({ ...current, timeline: true }));
                    set("timeline", option.value);
                  }}
                />
                <span className={styles.contact__dot} aria-hidden="true" />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.hint}</small>
                </span>
              </label>
            ))}
          </div>
          {timeline && "note" in timeline && timeline.note && (
            <p className={styles.contact__nurture} role="status">
              {timeline.note}
            </p>
          )}
          <FieldError id="timeline-error" message={err("timeline")} />
        </fieldset>

        <div className={styles.contact__fields}>
          <Field
            name="email"
            label="Work email"
            type="email"
            placeholder="you@company.com"
            value={values.email}
            error={err("email")}
            valid={EMAIL_RE.test(values.email.trim())}
            onChange={(value) => set("email", value)}
            onFocus={() => engage("email")}
            onBlur={() => leave("email", !values.email.trim())}
            autoComplete="email"
          />
          <Field
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={values.phone}
            error={err("phone")}
            hint="Used only to coordinate your demo."
            onChange={(value) => set("phone", value)}
            onFocus={() => engage("phone")}
            onBlur={() => leave("phone", false)}
            autoComplete="tel"
          />
        </div>

        <div className={styles.contact__notes}>
          {showNotes ? (
            <div className={styles.contact__field}>
              <label htmlFor="notes">Anything we should know? (optional)</label>
              <textarea
                id="notes"
                rows={3}
                value={values.notes}
                placeholder="Warehouses, stores, franchise outlets, the tools you use today…"
                onFocus={() => engage("notes")}
                onChange={(event) => set("notes", event.target.value)}
              />
            </div>
          ) : (
            <button
              type="button"
              className={styles.contact__notesToggle}
              onClick={() => setShowNotes(true)}
            >
              + Add context about your setup (optional)
            </button>
          )}
        </div>

        <label className={styles.contact__consent}>
          <input
            id="consent"
            type="checkbox"
            data-field="consent"
            checked={values.consent}
            aria-invalid={err("consent") ? true : undefined}
            aria-describedby={err("consent") ? "consent-error" : undefined}
            onChange={(event) => {
              setTouched((current) => ({ ...current, consent: true }));
              set("consent", event.target.checked);
            }}
          />
          <span>
            I agree that Fibonce may contact me about this demo request.
          </span>
        </label>
        <FieldError id="consent-error" message={err("consent")} />
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className={styles.contact__honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => {
            const next = event.target.value;
            setValues((current) => ({ ...current, website: next }));
          }}
        />
      </div>

      {submitError && (
        <div className={styles.contact__submitError} role="alert">
          <AlertCircle size={17} aria-hidden="true" />
          <span>
            {submitError}
            {failures >= 2 && hasSalesEmail && (
              <>
                {" "}
                Your answers are saved — you can also email us at{" "}
                <a href={`mailto:${siteConfig.salesEmail}`}>
                  {siteConfig.salesEmail}
                </a>
                .
              </>
            )}
          </span>
        </div>
      )}

      <div className={styles.contact__submitRow} hidden={formStep !== 1}>
        <button
          type="submit"
          className={styles.contact__submit}
          aria-disabled={!complete || status === "loading"}
          data-inactive={!complete || undefined}
        >
          {status === "loading" ? (
            <>
              <Loader2
                className={styles.contact__spin}
                size={18}
                aria-hidden="true"
              />{" "}
              Sending…
            </>
          ) : (
            <>
              Request my tailored demo <ArrowRight size={17} aria-hidden="true" />
            </>
          )}
        </button>
        <p className={styles.contact__submitHint}>
          {complete
            ? "We reply within one business day."
            : "Complete the required answers above to continue."}
        </p>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className={styles.contact__error} id={id}>
      {message}
    </p>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  hint,
  valid,
  type = "text",
  optional = false,
  placeholder,
  autoComplete,
}: {
  name: FieldName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  error?: string;
  hint?: string;
  valid?: boolean;
  type?: string;
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  const describedBy = error
    ? `${name}-error`
    : hint
      ? `${name}-hint`
      : undefined;
  return (
    <div className={styles.contact__field}>
      <label htmlFor={name}>
        {label}{" "}
        {optional ? (
          <span className={styles.contact__optional}>optional</span>
        ) : (
          <span aria-hidden="true">*</span>
        )}
      </label>
      <div className={styles.contact__inputWrap}>
        <input
          id={name}
          data-field={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
        />
        {valid && !error && (
          <span className={styles.contact__validMark} aria-hidden="true">
            <Check size={14} strokeWidth={3} />
          </span>
        )}
      </div>
      {error ? (
        <FieldError id={`${name}-error`} message={error} />
      ) : hint ? (
        <p className={styles.contact__hint} id={`${name}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
