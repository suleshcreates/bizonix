import styles from "@/components/pages/industries/industries.module.css";

export function IndustryPainHeader() {
  return (
    <header className={styles.industryPainSection__header}>
      <div>
        <p className={styles.industryPainSection__eyebrow}>What changes with Bizonix</p>
        <h2 id="industry-pain-title">
          Different pressure.
          <br />
          Different <span>response.</span>
        </h2>
      </div>
      <p className={styles.industryPainSection__intro}>
        Every industry runs into a different bottleneck. Bizonix adapts the
        operating model to remove it.
      </p>
    </header>
  );
}
