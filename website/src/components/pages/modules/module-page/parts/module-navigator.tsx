import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { modulePages } from "@/lib/content/modules/module-pages";
import {
  moduleRoute,
  moduleSlugs,
  type ModuleSlug,
} from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * Chapter position: previous module · this one · next module.
 *
 * The nine pages are one product read in sequence, so the hero closes on where
 * the reader is in that sequence rather than dropping them into a page with no
 * sense of the whole. Order is the canonical `moduleSlugs` array and nothing
 * else — the sequence wraps, so every module has both neighbours and no page
 * is a dead end.
 *
 * Deliberately compact: two links and a position, one row on desktop and a
 * stacked pair on a phone. It is orientation, not a second navigation system.
 */
export function ModuleNavigator({ slug }: { slug: ModuleSlug }) {
  const index = moduleSlugs.indexOf(slug);
  const total = moduleSlugs.length;
  const previous = modulePages[moduleSlugs[(index - 1 + total) % total]];
  const next = modulePages[moduleSlugs[(index + 1) % total]];

  return (
    <nav className={styles.modulePage__navigator} aria-label="Module sequence" data-reveal>
      <Link
        className={styles.modulePage__navStep}
        href={moduleRoute(previous.slug)}
        data-direction="previous"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        <span>
          <span className={styles.modulePage__navDirection}>Previous</span>
          <strong>{previous.title}</strong>
        </span>
      </Link>

      <p className={styles.modulePage__navPosition}>
        <span className={styles.modulePage__srOnly}>Currently reading: </span>
        <strong>{modulePages[slug].title}</strong>
        <span aria-hidden="true">·</span>
        <span>
          {String(index + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}
        </span>
      </p>

      <Link
        className={styles.modulePage__navStep}
        href={moduleRoute(next.slug)}
        data-direction="next"
      >
        <span>
          <span className={styles.modulePage__navDirection}>Next</span>
          <strong>{next.title}</strong>
        </span>
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </nav>
  );
}
