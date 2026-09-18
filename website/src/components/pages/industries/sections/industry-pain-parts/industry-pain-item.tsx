import styles from "@/components/pages/industries/industries.module.css";

export function IndustryPainItem({
  text,
  index,
}: {
  text: string;
  index: number;
}) {
  return (
    <li
      className={styles.industryPainSection__painItem}
      style={{ "--pain-index": index } as React.CSSProperties}
    >
      <span>{String(index + 1).padStart(2, "0")}</span>
      <i aria-hidden="true" />
      <strong>{text}</strong>
    </li>
  );
}
