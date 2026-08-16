import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./solutions-grid.module.css";

const solutionCards = [
  {
    title: "Inventory",
    slug: "inventory",
    href: "/modules/inventory",
    benefit: "Piece-level stock, always current.",
    image: "/product/modules/inventory.jpg",
  },
  {
    title: "Sales & POS",
    slug: "sales-pos",
    href: "/modules/sales-pos",
    benefit: "Fast at the counter, accurate in the books.",
    image: "/product/modules/sales-pos.jpg",
  },
  {
    title: "Wholesale",
    slug: "wholesale",
    href: "/modules/wholesale",
    benefit: "Bulk orders, credit, and fulfillment in one flow.",
    image: "/product/modules/wholesale.jpg",
  },
  {
    title: "Franchise",
    slug: "franchise",
    href: "/modules/franchise",
    benefit: "Partner outlets, HQ-governed allocation.",
    image: "/product/modules/franchise.jpg",
  },
  {
    title: "Accounting",
    slug: "accounting",
    href: "/modules/accounting",
    benefit: "GST-ready books that follow every movement.",
    image: "/product/modules/accounting.jpg",
  },
  {
    title: "Analytics",
    slug: "analytics",
    href: "/modules/analytics",
    benefit: "One read on sales, stock, and margin across entities.",
    image: "/product/modules/analytics.jpg",
  },
] as const;

export function SolutionsGrid() {
  return (
    <section className={styles.section} aria-labelledby="solutions-grid-title">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.shell}>
        {/* Section Header */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>The Full System</span>
          <h2 id="solutions-grid-title" className={styles.title}>
            Nine modules. One operating record.
          </h2>
          <p className={styles.description}>
            Explore the core operating modules that connect piece-level stock,
            counter billing, wholesale supply, franchise networks, and finance
            in one unified truth.
          </p>
        </header>

        {/* 6-Card Solutions Grid */}
        <div className={styles.grid}>
          {solutionCards.map((card) => (
            <Link
              key={card.slug}
              href={card.href}
              className={styles.card}
              aria-label={`Explore ${card.title} module`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={card.image}
                  alt={`${card.title} illustration`}
                  width={300}
                  height={300}
                  className={styles.illustration}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardBenefit}>{card.benefit}</p>
                <div className={styles.cardLink}>
                  <span>Explore module</span>
                  <ArrowRight size={15} className={styles.cardLinkIcon} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Link to All Modules */}
        <div className={styles.footerActions}>
          <Link href="/modules" className={styles.viewAllLink}>
            <span>View all 9 modules</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
