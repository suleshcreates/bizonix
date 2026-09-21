"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { trackModuleEvent } from "@/lib/analytics";
import { modulePages } from "@/lib/content/modules/module-pages";
import {
  moduleRoute,
  type ModuleSlug,
} from "@/lib/content/modules/module-pages/types";
import { ModuleHeading } from "./module-heading";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * Three complementary modules, rendered from the relationships authored in
 * module data. The shared geometry keeps this closing section consistent
 * across every deep module page.
 */
export function RelatedModules({
  related,
  moduleTitle,
  moduleSlug,
}: {
  related: readonly (ModuleSlug | string)[];
  moduleTitle: string;
  moduleSlug: string;
}) {
  return (
    <section
      className={styles.modulePage__related}
      aria-labelledby="module-related"
    >
      <div className={styles.modulePage__shell}>
        <header className={styles.modulePage__sectionHead}>
          <p className={styles.modulePage__eyebrow} data-reveal>
            <span
              className={styles.modulePage__eyebrowDot}
              aria-hidden="true"
            />
            Next
          </p>
          <ModuleHeading
            id="module-related"
            text={"What " + moduleTitle + " works with"}
            accent="works with"
          />
          <p data-reveal>
            Follow the connected modules that carry the same operating record
            into the next part of the business.
          </p>
        </header>

        <div className={styles.modulePage__relatedGrid}>
          {related.map((slug, index) => {
            const sibling = modulePages[slug as ModuleSlug];
            if (!sibling) return null;
            const Icon = sibling.icon;

            return (
              <Link
                key={slug}
                href={moduleRoute(slug)}
                className={styles.modulePage__relatedCard}
                data-reveal
                onClick={() =>
                  trackModuleEvent("module_related_clicked", {
                    module: moduleSlug,
                    target: slug,
                  })
                }
                style={
                  {
                    "--related-accent": sibling.theme.accent,
                  } as React.CSSProperties
                }
              >
                <span
                  className={styles.modulePage__relatedIcon}
                  aria-hidden="true"
                >
                  <Icon size={21} strokeWidth={1.8} />
                </span>

                <span className={styles.modulePage__relatedCopy}>
                  <small>
                    Connected module · {String(index + 1).padStart(2, "0")}
                  </small>
                  <strong>{sibling.title}</strong>
                  <span>{sibling.outcome}</span>
                </span>

                <span
                  className={styles.modulePage__relatedArrow}
                  aria-hidden="true"
                >
                  <ArrowRight size={17} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
