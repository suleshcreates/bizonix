"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * This used to be a newsletter form whose only handler was preventDefault() —
 * it accepted an address and dropped it. There is no subscription backend, so
 * rather than fake one it now hands the address to the contact form, which
 * reads ?email= and is wired to a real endpoint.
 */
export function FooterSubscribe() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    router.push(
      `/contact?email=${encodeURIComponent(value)}&utm_source=footer`,
    );
  };

  return (
    <form className="footer-action-form" onSubmit={submit} noValidate>
      <div
        className="footer-action-field"
        data-invalid={error ? "true" : undefined}
      >
        <input
          id="footer-email"
          type="email"
          name="email"
          value={email}
          placeholder="you@company.com"
          className="footer-action-input"
          aria-label="Work email"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "footer-email-error" : undefined}
          autoComplete="email"
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
        />
        <button type="submit" className="footer-action-btn">
          <span>Continue</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>

      <p
        id="footer-email-error"
        className="footer-action-note"
        data-tone={error ? "error" : undefined}
        role={error ? "alert" : undefined}
      >
        {error ?? "Takes you to the booking form with your email filled in."}
      </p>
    </form>
  );
}
