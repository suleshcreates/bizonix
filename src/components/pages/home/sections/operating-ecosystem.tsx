import { EcosystemFlow } from "./operating-ecosystem-parts/ecosystem-flow";
import { EcosystemNetwork } from "./operating-ecosystem-parts/ecosystem-network";
import styles from "@/components/pages/home/home.module.css";

/**
 * One platform, every operating entity.
 *
 * Told twice because the geometry has to differ: the approved spatial network
 * at >= 761px, a vertical operating story below it. Both read the same
 * `operatingEnvironments` and the same proof artifacts, and only one is ever
 * displayed.
 */
export function OperatingEcosystem() {
  return (
    <section
      id="who-its-for"
      className={styles.operatingEcosystem__section}
      aria-labelledby="ecosystem-title"
    >
      <div className={styles.operatingEcosystem__shell}>
        <header className={styles.operatingEcosystem__header}>
          <span className={styles.operatingEcosystem__eyebrow}>
            <i /> One platform <b>•</b> Every operating entity <i />
          </span>
          <h2 id="ecosystem-title" className={styles.operatingEcosystem__title}>
            Build and Run{" "}
            <span className={styles.operatingEcosystem__titleUnit}>
              Multi-Entity
            </span>{" "}
            <br />
            Operations <em>10x Faster</em>
          </h2>
          <p>
            The complete cloud ERP designed for modern retail, wholesale, and
            franchise brands. Connect inventory, billing, transfers, and
            financials into one unified source of truth.
          </p>
        </header>

        <EcosystemNetwork />
        <EcosystemFlow />
      </div>
    </section>
  );
}
