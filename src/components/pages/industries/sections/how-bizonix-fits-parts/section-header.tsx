import styles from "@/components/pages/industries/industries.module.css";

/** A neutral system mark for the contextual note. Not a brand logo. */
function ContextMark() {
  return (
    <svg
      className={styles.howBizonixFits__contextMark}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path d="M16 6v20M6 16h20" stroke="#2f6bff" strokeOpacity="0.22" strokeWidth="1" />
      <circle cx="16" cy="16" r="4.4" stroke="#0b1f3a" strokeWidth="1.3" />
      <circle cx="16" cy="5" r="2.2" fill="#2f6bff" />
      <circle cx="27" cy="16" r="2.2" fill="#2ec4b6" />
      <circle cx="16" cy="27" r="2.2" fill="#2f6bff" />
      <circle cx="5" cy="16" r="2.2" fill="#0b1f3a" />
    </svg>
  );
}

export function SectionHeader() {
  return (
    <header className={styles.howBizonixFits__header}>
      <div className={styles.howBizonixFits__headerMain}>
        <p className={styles.howBizonixFits__eyebrow}>Section 03</p>
        <h2 id="how-bizonix-fits-title" className={styles.howBizonixFits__title}>
          How Bizonix <span>fits.</span>
        </h2>
        <p className={styles.howBizonixFits__kicker}>Mapped modules</p>
        <p className={styles.howBizonixFits__summary}>
          The right modules, assembled around the way each industry operates.
        </p>
      </div>
      <aside className={styles.howBizonixFits__context}>
        <ContextMark />
        <p>
          Different industries. Different needs.
          <br />
          One connected platform.
        </p>
      </aside>
    </header>
  );
}
