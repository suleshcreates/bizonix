import styles from "@/components/pages/product/product.module.css";

export function FlowLegend() {
  return (
    <div className={styles.finalSystemMap__flowLegend} aria-label="System map connection legend">
      <div className={styles.finalSystemMap__legendItem}>
        <span className={styles.finalSystemMap__legendLineBlue} aria-hidden="true" />
        <span>Operations</span>
      </div>
      <div className={styles.finalSystemMap__legendItem}>
        <span className={styles.finalSystemMap__legendLineTeal} aria-hidden="true" />
        <span>Data</span>
      </div>
      <div className={styles.finalSystemMap__legendItem}>
        <span
          className={styles.finalSystemMap__legendLineBlue}
          style={{
            background: "linear-gradient(90deg, #2f6bff, #2ec4b6)",
          }}
          aria-hidden="true"
        />
        <span>Visibility</span>
      </div>
    </div>
  );
}
