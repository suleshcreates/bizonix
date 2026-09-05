"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { trackModuleEvent } from "@/lib/analytics";
import { modulePages } from "@/lib/content/modules/module-pages";
import {
  moduleRoute,
  type ModuleSlug,
} from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The three sibling modules this one is most often bought with. The
 * relationships live in module data — the template has no idea which modules
 * are related to which — and each card carries the sibling's own accent so the
 * row reads as a map of the system rather than three identical tiles.
 */
export function RelatedModules({
  related,
  moduleTitle,
  moduleSlug,
}: {
  related: readonly ModuleSlug[];
  moduleTitle: string;
  moduleSlug: string;
}) {
  return (
    <section className={styles.modulePage__related} aria-labelledby="module-related">
      <div className={styles.modulePage__shell}>
        <header className={styles.modulePage__sectionHead}>
          <p className={styles.modulePage__eyebrow} data-reveal>
            <span className={styles.modulePage__eyebrowDot} aria-hidden="true" />
            Next
          </p>
          <h2 id="module-related" data-reveal>
            What {moduleTitle} works with
          </h2>
        </header>

        <div className={styles.modulePage__relatedGrid}>
          {related.map((slug) => {
            const sibling = modulePages[slug];
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
                  { "--related-accent": sibling.theme.accent } as React.CSSProperties
                }
              >
                <span className={styles.modulePage__relatedIcon} aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span>
                  <strong>{sibling.title}</strong>
                  <span>{sibling.outcome}</span>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
