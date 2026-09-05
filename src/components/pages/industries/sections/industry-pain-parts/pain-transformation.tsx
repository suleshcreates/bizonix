import styles from "@/components/pages/industries/industries.module.css";

export function PainTransformation() {
  return (
    <svg
      className={styles.industryPainSection__transformationGraphic}
      viewBox="0 0 168 34"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="9" r="3" />
      <circle cx="8" cy="25" r="3" />
      <circle cx="29" cy="17" r="3" />
      <path d="M38 17H160" pathLength="1" />
      <circle cx="160" cy="17" r="5" />
    </svg>
  );
}
