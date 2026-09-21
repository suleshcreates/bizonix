import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import styles from "@/components/pages/industries/industries.module.css";

/**
 * Hairline rows rather than cards — the same restraint the industries hero
 * uses for its benefits list.
 */
export function PressureList({
  pains,
  intro,
  industryName,
}: {
  pains: IndustryDetail["pains"];
  intro?: { eyebrow?: string; title?: string; lede?: string };
  industryName?: string;
}) {
  const eyebrow = intro?.eyebrow || "Where clarity breaks";
  const title =
    intro?.title ||
    (industryName
      ? `${industryName} carries more context than a stock number can hold.`
      : "Apparel carries more context than a stock number can hold.");
  const lede =
    intro?.lede ||
    (industryName
      ? `Pressures that show up in almost every ${industryName.toLowerCase()} operation. None of them are solved by counting harder.`
      : "Five pressures show up in almost every apparel operation. None of them are solved by counting harder.");

  return (
    <section className={styles.industryDetailPage__pressure} aria-labelledby="pressure-title">
      <div className={`${styles.industryDetailPage__shell} ${styles.industryDetailPage__pressureGrid}`}>
        <div className={styles.industryDetailPage__pressureIntro}>
          <p className={styles.industryDetailPage__eyebrow}>
            <span className={styles.industryDetailPage__eyebrowDot} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id="pressure-title">{title}</h2>
          <p className={styles.industryDetailPage__pressureLede}>{lede}</p>
        </div>

        <ol className={styles.industryDetailPage__pressureList}>
          {pains.map((pain, index) => (
            <li key={pain.title}>
              <span className={styles.industryDetailPage__pressureIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{pain.title}</h3>
                <p>{pain.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
