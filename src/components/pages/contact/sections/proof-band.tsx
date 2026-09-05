"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import {
  approvedLogos,
  proofQuote,
  qualitativeEvidence,
  verifiedProof,
} from "@/lib/content/contact/contact-content";
import { StatValue, useReveal } from "./motion";
import styles from "@/components/pages/contact/contact.module.css";

/**
 * Proof for cold traffic.
 *
 * The stat row renders whatever `verifiedProof` holds; until real figures are
 * approved for public use it falls back to the qualitative evidence already
 * published in `proof-stories.ts`. Numeric values count up on scroll, text
 * values simply fade in — one component, no second code path. Same rule for the
 * logo wall: no written permission, no logos.
 */
export function ProofBand() {
  const { ref, revealed } = useReveal<HTMLElement>();
  const stats = verifiedProof ?? qualitativeEvidence;

  return (
    <section
      ref={ref}
      className={styles.contact__proof}
      aria-labelledby="proof-title"
      data-reveal
      data-revealed={revealed ? "true" : undefined}
    >
      <div className={styles.contact__shell}>
        <h2 id="proof-title" className={styles.contact__proofTitle}>
          What operators tell us changes
        </h2>

        {approvedLogos.length > 0 && (
          <ul className={styles.contact__logos} aria-label="Businesses running on Bizonix">
            {approvedLogos.map((logo, index) => (
              <li key={logo.name} style={{ "--i": index } as React.CSSProperties}>
                <Image src={logo.src} alt={logo.name} width={120} height={36} />
              </li>
            ))}
          </ul>
        )}

        <figure className={styles.contact__quote}>
          <Quote className={styles.contact__quoteMark} size={38} aria-hidden="true" />
          <blockquote>
            <p>{proofQuote.text}</p>
          </blockquote>
          <figcaption>
            <span className={styles.contact__quoteAvatar} aria-hidden="true">
              {proofQuote.attribution.slice(0, 1)}
            </span>
            <span>
              <strong>{proofQuote.attribution}</strong>
              <small>{proofQuote.context}</small>
            </span>
          </figcaption>
        </figure>

        <ul className={styles.contact__evidence}>
          {stats.map((item, index) => (
            <li key={item.label} style={{ "--i": index } as React.CSSProperties}>
              <strong>
                <StatValue value={item.value} active={revealed} />
              </strong>
              <span>{item.label}</span>
              {"detail" in item && item.detail && <small>{item.detail}</small>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
