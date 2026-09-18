import styles from "@/components/pages/home/home.module.css";

/**
 * Editorial introduction for the module showcase. Occupies the upper portion
 * of the composition on a single controlled content width — never a side
 * column competing with the orbit.
 */
export function ModuleShowcaseHeader() {
  return (
    <header className={styles.moduleShowcase__header} data-ms-header>
      <span className={styles.moduleShowcase__eyebrow}>
        <i /> Our modules <i />
      </span>
      <h2 id="module-showcase-title" className={styles.moduleShowcase__title}>
        Everything you need,
        <br />
        in one <em>powerful system</em>
      </h2>
      <p>
        Integrated modules. Connected workflow.
        <br />
        Complete control across your entire business.
      </p>
    </header>
  );
}
