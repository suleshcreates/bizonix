import styles from "@/components/pages/product/product.module.css";

export function IntegrationHeader() {
  return (
    <div className={styles.integrationSurface__header}>
      <div className={styles.integrationSurface__eyebrowWrap}>
        <span className={styles.integrationSurface__eyebrowLine} aria-hidden="true" />
        <span className={styles.integrationSurface__eyebrowText}>Integration surface</span>
      </div>
      <h2 className={styles.integrationSurface__headline}>
        Connected where the workflow is{" "}
        <span className={styles.integrationSurface__highlightReal}>real.</span>
      </h2>
      <p className={styles.integrationSurface__supportingCopy}>
        Bizonix integrates with the channels businesses already use—and opens up
        what&apos;s coming.
      </p>
    </div>
  );
}
