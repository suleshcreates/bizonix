import { industryPressures } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustryPressureHeader } from "./industry-pressure-parts/industry-pressure-header";
import { IndustryPressureRow } from "./industry-pressure-parts/industry-pressure-row";

export function IndustryPressureSection() {
  return (
    <section className={styles.industryPressureSection__section} aria-labelledby="industry-pressure-title">
      <div className={styles.industryPressureSection__atmosphere} aria-hidden="true" />
      <div className={styles.industryPressureSection__shell}>
        <IndustryPressureHeader />
        <div className={styles.industryPressureSection__rows}>
          {industryPressures.map((item, index) => (
            <IndustryPressureRow key={item.id} item={item} index={index} />
          ))}
        </div>
        <p className={styles.industryPressureSection__closing}>
          One operating model. <span>Three different realities.</span>
        </p>
      </div>
    </section>
  );
}
