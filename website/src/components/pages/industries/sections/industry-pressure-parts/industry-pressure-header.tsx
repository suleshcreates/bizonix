import styles from "@/components/pages/industries/industries.module.css";

export function IndustryPressureHeader() {
  return (
    <header className={styles.industryPressureSection__header}>
      <div>
        <p className={styles.industryPressureSection__eyebrow}>What changes with Bizonix</p>
        <h2 id="industry-pressure-title">
          Different pressure.
          <br />
          Different <span>response.</span>
        </h2>
      </div>
      <p className={styles.industryPressureSection__intro}>
        Every industry runs into a different bottleneck. Bizonix adapts the
        operating model to remove it.
      </p>
    </header>
  );
}
