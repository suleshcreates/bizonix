import Link from "next/link";
import type { ShowcaseModule } from "@/lib/content/modules/modules";
import styles from "@/components/pages/home/home.module.css";

/**
 * A single module node. Every module renders through this component — one
 * icon, one title, one editorial number, one route. Uniform dimensions come
 * from the shared `--node-w` token; hover weight lives on the inner skin so
 * it can never fight the assembly transforms on the link itself.
 */
export function ModuleNode({ module }: { module: ShowcaseModule }) {
  const Icon = module.icon;
  return (
    <Link
      href={module.route}
      className={styles.moduleShowcase__node}
      data-ms-node
      style={
        {
          "--accent": module.accent,
          "--accent-soft": `${module.accent}1f`,
        } as React.CSSProperties
      }
    >
      <span className={styles.moduleShowcase__nodeSkin}>
        <span className={styles.moduleShowcase__nodeIcon}>
          <Icon strokeWidth={1.9} aria-hidden />
        </span>
        <span className={styles.moduleShowcase__nodeText}>
          <span className={styles.moduleShowcase__nodeNumber}>{module.number}</span>
          <span className={styles.moduleShowcase__nodeTitle}>{module.title}</span>
        </span>
      </span>
    </Link>
  );
}
