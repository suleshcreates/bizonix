"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import {
  calendarSection,
  contactHero,
  heroCta,
  successCopy,
  trackToggle,
  trustPoints,
  type DemoTrack,
} from "@/lib/content/contact/contact-content";
import {
  isWarmSource,
  readUtmParams,
  track as trackEvent,
} from "@/lib/analytics";
import { AltContact } from "./sections/alt-contact";
import { BookingPanel } from "./sections/booking-panel";
import { DemoFaq } from "./sections/demo-faq";
import { DemoForm, type FormValues } from "./sections/demo-form";
import { ProofBand } from "./sections/proof-band";
import { SessionCard } from "./sections/session-card";
import styles from "@/components/pages/contact/contact.module.css";

const noopSubscribe = () => () => {};

/**
 * Which track a visitor lands on is decided by the URL and referrer — external
 * state, read through a frozen snapshot so the choice cannot cascade renders.
 * The server always renders "brief": it is the safe default for cold traffic
 * and reads fine to everyone, and the hero reserves a fixed height so the warm
 * upgrade costs no layout shift.
 */
let landingTrack: DemoTrack | null = null;

function readLandingTrack(): DemoTrack {
  if (landingTrack) return landingTrack;
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("track");
  if (forced === "book" || forced === "brief") {
    landingTrack = forced;
  } else {
    landingTrack = isWarmSource(readUtmParams(params), document.referrer)
      ? "book"
      : "brief";
  }
  return landingTrack;
}

const readServerTrack = (): DemoTrack => "brief";

/** Guards against a remount (or a dev double-effect) counting the view twice. */
let viewCounted = false;
const countView = () => {
  if (viewCounted) return false;
  viewCounted = true;
  return true;
};

export function ContactPage() {
  const landed = useSyncExternalStore(
    noopSubscribe,
    readLandingTrack,
    readServerTrack,
  );
  const [chosen, setChosen] = useState<DemoTrack | null>(null);
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const activeTrack = chosen ?? landed;

  useEffect(() => {
    if (!countView()) return;
    trackEvent("contact_page_view", {
      ...readUtmParams(new URLSearchParams(window.location.search)),
      entry_track: readLandingTrack(),
      referrer: document.referrer || "direct",
    });
  }, []);

  // The form is taller than the confirmation that replaces it, so on a phone the
  // success message can land above the fold. Bring it back into view.
  useEffect(() => {
    if (!submitted) return;
    successRef.current?.scrollIntoView({ block: "center" });
  }, [submitted]);

  const choose = (next: DemoTrack, scroll = false) => {
    if (next !== activeTrack) {
      setChosen(next);
      trackEvent("contact_track_selected", { track: next });
    }
    if (scroll) actionRef.current?.scrollIntoView({ block: "start" });
  };

  const copy = contactHero[activeTrack];

  return (
    <div className={styles.contact__page}>
      <section
        className={styles.contact__stage}
        aria-labelledby="contact-title"
        id="book"
      >
        <span className={styles.contact__heroWash} aria-hidden="true" />
        <span className={styles.contact__heroGrain} aria-hidden="true" />
        <div className={styles.contact__shell}>
          <div className={styles.contact__stageGrid}>
            <div className={styles.contact__heroCopy}>
              <p
                className={styles.contact__eyebrow}
                style={{ "--d": "0ms" } as React.CSSProperties}
              >
                <span aria-hidden="true" />
                {contactHero.eyebrow}
              </p>
              <h1
                id="contact-title"
                style={{ "--d": "80ms" } as React.CSSProperties}
              >
                {copy.headline} <span>{copy.headlineAccent}</span>
              </h1>
              <p
                className={styles.contact__lede}
                style={{ "--d": "160ms" } as React.CSSProperties}
              >
                {copy.lede}
              </p>

              <ul className={styles.contact__trust}>
                {trustPoints.map((point, index) => (
                  <li
                    key={point}
                    style={
                      { "--d": `${240 + index * 90}ms` } as React.CSSProperties
                    }
                  >
                    <span
                      className={styles.contact__trustTick}
                      aria-hidden="true"
                    >
                      <Check size={11} strokeWidth={3.4} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div
                className={styles.contact__heroActions}
                style={{ "--d": "540ms" } as React.CSSProperties}
                role="group"
                aria-label={trackToggle.label}
              >
                <button
                  type="button"
                  className={styles.contact__btnPrimary}
                  aria-pressed={activeTrack === heroCta.primary.id}
                  onClick={() => choose(heroCta.primary.id, true)}
                >
                  {heroCta.primary.label}
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.contact__btnSecondary}
                  aria-pressed={activeTrack === heroCta.secondary.id}
                  onClick={() => choose(heroCta.secondary.id, true)}
                >
                  {heroCta.secondary.label}
                </button>
              </div>

              <button
                type="button"
                className={styles.contact__skipLink}
                style={{ "--d": "620ms" } as React.CSSProperties}
                onClick={() => choose("book", true)}
              >
                {heroCta.skip} <span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Ordered after the task on mobile: reassurance, not a gate. */}
            <div
              className={styles.contact__heroVisual}
              style={{ "--d": "300ms" } as React.CSSProperties}
            >
              <SessionCard />
            </div>

            <div className={styles.contact__actionCol} ref={actionRef}>
              <h2 className={styles.contact__srOnly}>Book your demo</h2>
              {!submitted && (
                <div
                  className={styles.contact__segmented}
                  role="group"
                  aria-label={trackToggle.label}
                >
                  {trackToggle.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={styles.contact__segment}
                      aria-pressed={activeTrack === option.id}
                      onClick={() => choose(option.id)}
                    >
                      {option.short}
                    </button>
                  ))}
                </div>
              )}

              {submitted ? (
                <div className={styles.contact__successWrap}>
                  <div
                    className={styles.contact__success}
                    role="status"
                    ref={successRef}
                  >
                    <span
                      className={styles.contact__successGlyph}
                      aria-hidden="true"
                    >
                      <CheckCircle2 size={30} strokeWidth={1.8} />
                    </span>
                    <h3>{successCopy.title}</h3>
                    <p>{successCopy.body}</p>
                    <p className={styles.contact__successStepsTitle}>
                      {successCopy.stepsTitle}
                    </p>
                    <ol className={styles.contact__successSteps}>
                      {successCopy.steps.map((step, index) => (
                        <li
                          key={step}
                          style={
                            {
                              "--d": `${300 + index * 140}ms`,
                            } as React.CSSProperties
                          }
                        >
                          <Check
                            size={13}
                            strokeWidth={3.2}
                            aria-hidden="true"
                          />
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <CalendarBlock
                    prefill={{
                      email: submitted.email,
                      company: submitted.companyName,
                    }}
                  />
                </div>
              ) : activeTrack === "book" ? (
                <div className={styles.contact__bookWrap}>
                  <CalendarBlock onRequestDetails={() => choose("brief")} />
                  <p className={styles.contact__switch}>
                    Would rather we prepared first?{" "}
                    <button type="button" onClick={() => choose("brief")}>
                      Tell us your priorities
                    </button>
                  </p>
                </div>
              ) : (
                <div className={styles.contact__formWrap}>
                  <DemoForm onSuccess={setSubmitted} />
                  <p className={styles.contact__switch}>
                    Already know what you need?{" "}
                    <button type="button" onClick={() => choose("book")}>
                      Skip ahead and pick a time
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProofBand />

      <div className={styles.contact__shell}>
        <DemoFaq />
        <AltContact />
      </div>
    </div>
  );
}

function CalendarBlock({
  prefill,
  onRequestDetails,
}: {
  prefill?: { email?: string; company?: string };
  onRequestDetails?: () => void;
}) {
  return (
    <section
      className={styles.contact__calendar}
      id="calendly-section"
      aria-labelledby="calendar-title"
    >
      <div className={styles.contact__calendarHead}>
        <h3 id="calendar-title">{calendarSection.title}</h3>
        <p>{calendarSection.body}</p>
        {/* Renders only when the provider reports a real remaining count. */}
        {typeof calendarSection.slotsLeft === "number" &&
          calendarSection.slotsLeft <= 5 && (
            <p className={styles.contact__scarcity}>
              Only {calendarSection.slotsLeft} slots left this week
            </p>
          )}
      </div>
      <BookingPanel
        prefill={prefill}
        onRequestDetails={onRequestDetails}
        compact
      />
    </section>
  );
}
