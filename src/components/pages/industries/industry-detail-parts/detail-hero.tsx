import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import styles from "@/components/pages/industries/industries.module.css";

/**
 * Reads the same grid the matrix section renders, so the hero tease can never
 * quote a number the page then contradicts.
 */
function summarise(matrix: NonNullable<IndustryDetail["matrix"]>) {
  const cells = matrix.colourways.flatMap((colourway) =>
    matrix.sizes.map((_, index) =>
      Object.values(colourway.stock).reduce(
        (total, row) => total + (row[index] ?? 0),
        0,
      ),
    ),
  );
  return {
    units: cells.reduce((total, value) => total + value, 0),
    cells: cells.length,
    empty: cells.filter((value) => value === 0).length,
  };
}

export function DetailHero({ data }: { data: IndustryDetail }) {
  const summary = data.matrix ? summarise(data.matrix) : null;

  return (
    <section
      className={styles.industryDetailPage__hero}
      aria-labelledby="industry-title"
    >
      <span
        className={styles.industryDetailPage__heroAtmosphere}
        aria-hidden="true"
      />

      <div className={styles.industryDetailPage__shell}>
        <nav
          className={styles.industryDetailPage__crumbs}
          aria-label="Breadcrumb"
        >
          <Link href="/industries">Industries</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">{data.name}</span>
        </nav>

        <div className={styles.industryDetailPage__heroGrid}>
          <div className={styles.industryDetailPage__heroCopy}>
            <p className={styles.industryDetailPage__eyebrow}>
              <span
                className={styles.industryDetailPage__eyebrowDot}
                aria-hidden="true"
              />
              {data.eyebrow}
            </p>{" "}
            <h1 id="industry-title">{data.hero.title}</h1>
            <p className={styles.industryDetailPage__heroBody}>
              {data.hero.body}
            </p>
            <div className={styles.industryDetailPage__actions}>
              <Link
                className={styles.industryDetailPage__primary}
                href="/contact?utm_source=apparel-footwear"
              >
                Book a demo
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a
                className={styles.industryDetailPage__secondary}
                href="#variants"
              >
                See it on a real style
                <ChevronRight size={16} aria-hidden="true" />
              </a>
            </div>
            <dl className={styles.industryDetailPage__heroFacts}>
              <div>
                <dt>Tracked at</dt>
                <dd>Size &amp; colour</dd>
              </div>
              <div>
                <dt>Across</dt>
                <dd>Store, warehouse, partner</dd>
              </div>
              <div>
                <dt>Modules</dt>
                <dd>{data.fit.modules.length} connected</dd>
              </div>
            </dl>
          </div>

          <figure className={styles.industryDetailPage__heroMedia}>
            <Image
              className={styles.industryDetailPage__heroImage}
              src={data.hero.image}
              alt={data.hero.alt}
              fill
              preload
              sizes="(max-width: 1080px) 100vw, 56vw"
            />
            <span
              className={styles.industryDetailPage__heroImageWash}
              aria-hidden="true"
            />

            {summary ? (
              <figcaption className={styles.industryDetailPage__heroChip}>
                <span className={styles.industryDetailPage__heroChipHead}>
                  {data.matrix?.style}
                </span>
                <strong>{summary.units.toLocaleString("en-IN")}</strong>
                <span className={styles.industryDetailPage__heroChipUnit}>
                  units in stock
                </span>
                <span className={styles.industryDetailPage__heroChipSplit}>
                  {summary.cells} variant cells
                  <i aria-hidden="true" />
                  <em>{summary.empty} empty</em>
                </span>
              </figcaption>
            ) : null}
          </figure>
        </div>
      </div>
    </section>
  );
}
