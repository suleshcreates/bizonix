import styles from "@/components/pages/product/product.module.css";

export function SecurityHeader({ titleId }: { titleId: string }) {
  return (
    <header className={styles.securityTenancy__header}>
      <div>
        <span className={styles.securityTenancy__eyebrow}>Security &amp; tenancy</span>
        {/* The desktop break lands after "designed"; a phone cannot fit
            "around the operating model." on one line, so below the breakpoint
            the break is dropped and the measure sets it instead. */}
        <h2 id={titleId} className={styles.securityTenancy__title}>
          Access designed
          <br className={styles.securityTenancy__titleBreak} />{" "}
          around the{" "}
          <span className={styles.securityTenancy__titleAccent}>
            operating
            <span className={styles.securityTenancy__titleAccentTeal}> model.</span>
          </span>
        </h2>
      </div>
      <p className={styles.securityTenancy__lede}>
        Bizonix applies roles and entity scope to real operational
        responsibility. No unconfirmed certification claims
        <span className={styles.securityTenancy__ledeTail}>
          {" — just precise access architecture that matches how you operate"}
        </span>
        .
      </p>
    </header>
  );
}
