import { AlertTriangle, Check } from "lucide-react";
import type { ModuleCapabilities as Capabilities } from "@/lib/content/modules/module-pages/types";
import { ModuleHeading } from "./module-heading";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * Capabilities as grouped clusters, using the function names that appear in
 * the product — not one long bullet wall. Each group carries a line of context
 * so a reader can skip the groups that are not their job.
 *
 * `limitations` renders only when the module data actually declares one. The
 * block is never invented to look balanced.
 */
export function ModuleCapabilities({
  capabilities,
  moduleTitle,
}: {
  capabilities: Capabilities;
  moduleTitle: string;
}) {
  return (
    <section
      className={styles.modulePage__capabilities}
      aria-labelledby="module-capabilities"
    >
      <div className={styles.modulePage__shell}>
        <header className={styles.modulePage__sectionHead}>
          <p className={styles.modulePage__eyebrow} data-reveal>
            <span
              className={styles.modulePage__eyebrowDot}
              aria-hidden="true"
            />
            Capabilities
          </p>
          <ModuleHeading
            id="module-capabilities"
            text={"What " + moduleTitle + " covers"}
            accent={moduleTitle + " covers"}
          />
          <p data-reveal>
            Grouped by the job being done, using the function names you will see
            inside the product.
          </p>
        </header>

        <div className={styles.modulePage__capabilityGrid}>
          {capabilities.groups.map((group) => (
            <article
              key={group.id}
              className={styles.modulePage__capabilityGroup}
              data-reveal
            >
              <h3>{group.title}</h3>
              <p className={styles.modulePage__capabilityContext}>
                {group.context}
              </p>
              <ul className={styles.modulePage__capabilityItems}>
                {group.items.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {capabilities.limitations && capabilities.limitations.length > 0 ? (
          <div className={styles.modulePage__limitations} data-reveal>
            <p className={styles.modulePage__limitationsHead}>
              <AlertTriangle size={15} aria-hidden="true" />
              What this module does not do yet
            </p>
            <ul>
              {capabilities.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
