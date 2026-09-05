"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  CalendarDays,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { hasWhatsApp, siteConfig } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import styles from "@/components/pages/contact/contact.module.css";

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";
const LOAD_TIMEOUT_MS = 8000;

type Phase = "facade" | "loading" | "ready" | "unavailable";

/**
 * Calendly is never in the critical path: the script is fetched only after a
 * deliberate click, and every failure mode (not configured, blocked, slow
 * connection, third-party outage) falls back to a path that still converts.
 */
export function BookingPanel({
  prefill,
  compact = false,
  onRequestDetails,
}: {
  prefill?: { email?: string; name?: string; company?: string };
  compact?: boolean;
  /**
   * Supplied when we do not yet hold the visitor's details. Without it the
   * unavailable state is a dead end: we would promise to send times to someone
   * we cannot reach.
   */
  onRequestDetails?: () => void;
}) {
  const configured = Boolean(siteConfig.calendlyUrl);
  const [phase, setPhase] = useState<Phase>(
    configured ? "facade" : "unavailable",
  );
  const mountRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Calendly reports a completed booking by postMessage.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        typeof event.origin !== "string" ||
        !event.origin.includes("calendly.com")
      )
        return;
      const data = event.data as { event?: string };
      if (data?.event === "calendly.event_scheduled")
        track("contact_calendly_booked");
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const buildUrl = () => {
    const url = new URL(siteConfig.calendlyUrl);
    url.searchParams.set("hide_gdpr_banner", "1");
    if (prefill?.email) url.searchParams.set("email", prefill.email);
    if (prefill?.name) url.searchParams.set("name", prefill.name);
    if (prefill?.company) url.searchParams.set("a1", prefill.company);
    return url.toString();
  };

  const load = () => {
    if (phase !== "facade") return;
    setPhase("loading");
    track("contact_calendly_opened");

    timeoutRef.current = window.setTimeout(
      () => setPhase("unavailable"),
      LOAD_TIMEOUT_MS,
    );

    const init = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      const widget = window as unknown as {
        Calendly?: {
          initInlineWidget: (options: Record<string, unknown>) => void;
        };
      };
      if (!widget.Calendly || !mountRef.current) {
        setPhase("unavailable");
        return;
      }
      widget.Calendly.initInlineWidget({
        url: buildUrl(),
        parentElement: mountRef.current,
      });
      setPhase("ready");
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SRC}"]`,
    );
    if (existing) {
      init();
      return;
    }
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = init;
    script.onerror = () => setPhase("unavailable");
    document.head.appendChild(script);
  };

  if (phase === "unavailable") {
    return (
      <div
        className={`${styles.contact__booking} ${compact ? styles.contact__bookingCompact : ""}`}
      >
        <span className={styles.contact__bookingGlyph} aria-hidden="true">
          <CalendarCheck size={20} strokeWidth={1.7} />
        </span>
        <h3>We will send you times</h3>
        <p>
          {onRequestDetails
            ? "Live scheduling is not available right now. Leave your details and we will email you two or three slots that fit your week."
            : "Live scheduling is not available right now, so we will email you two or three slots that fit your week. Nothing else is needed from you."}
        </p>
        {onRequestDetails && (
          <button
            type="button"
            className={styles.contact__bookingCta}
            onClick={onRequestDetails}
          >
            Leave your details
          </button>
        )}
        {hasWhatsApp && (
          <a
            className={styles.contact__bookingAlt}
            href={siteConfig.whatsappUrl}
            onClick={() =>
              track("contact_whatsapp_clicked", {
                placement: "booking-fallback",
              })
            }
          >
            <MessageCircle size={17} aria-hidden="true" /> Sort it out on
            WhatsApp instead
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${styles.contact__booking} ${compact ? styles.contact__bookingCompact : ""}`}
    >
      {phase === "facade" && (
        <>
          <span className={styles.contact__bookingGlyph} aria-hidden="true">
            <CalendarDays size={20} strokeWidth={1.7} />
          </span>
          <h3>Pick a time</h3>
          <p>
            Thirty minutes with someone who knows the workflows. The calendar
            loads when you are ready — we do not run it in the background.
          </p>
          <button type="button" className={styles.contact__bookingCta} onClick={load}>
            Show available times
          </button>
        </>
      )}
      {phase === "loading" && (
        <p className={styles.contact__bookingLoading} role="status">
          <Loader2 className={styles.contact__spin} size={18} aria-hidden="true" />{" "}
          Loading the calendar…
        </p>
      )}
      <div
        ref={mountRef}
        className={styles.contact__calendlyMount}
        data-visible={phase === "ready" ? "true" : undefined}
      />
    </div>
  );
}
