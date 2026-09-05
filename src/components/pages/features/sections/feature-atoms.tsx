import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  relatedModules,
  type FeatureId,
} from "@/lib/content/features/features";
import styles from "@/components/pages/features/features.module.css";

/**
 * The two pieces every feature viewport shares.
 *
 * Deliberately small: the whole point of this page is that each feature owns
 * its own layout and its own mechanism, so the only things held in common are
 * the marker that says which of the five you are looking at, and the exit into
 * the modules that carry it.
 */

export function FeatureMark({
  index,
  discipline,
  tone,
}: {
  index: string;
  discipline: string;
  tone: "light" | "dark";
}) {
  return (
    <p className={styles.featureAtoms__mark} data-tone={tone}>
      <span className={styles.featureAtoms__markIndex}>{index}</span>
      <span className={styles.featureAtoms__markRule} aria-hidden="true" />
      <span className={styles.featureAtoms__markLabel}>{discipline}</span>
    </p>
  );
}

export function RelatedModules({
  id,
  tone,
}: {
  id: FeatureId;
  tone: "light" | "dark";
}) {
  return (
    <div className={styles.featureAtoms__related} data-tone={tone}>
      <span className={styles.featureAtoms__relatedLabel}>Carried by</span>
      <ul>
        {relatedModules[id].map((module) => (
          <li key={module.href}>
            <Link href={module.href}>
              {module.label}
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
