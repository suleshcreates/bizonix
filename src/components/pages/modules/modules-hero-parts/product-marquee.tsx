import Image from "next/image";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * Diagonal, infinitely-looping field of real Bizonix screens used as hero
 * scenery. Every row renders its card set twice and travels exactly -50%, so
 * the loop has no seam; the wrapper is masked on all sides so a row is never
 * seen entering or leaving the frame.
 */

type Screen = {
  src: string;
  width: number;
  height: number;
  module: string;
  view: string;
  /** Crop anchor — keeps the most legible part of each screenshot in frame. */
  focus: string;
};

const screens: readonly Screen[] = [
  {
    src: "/images/shared/product-screens/stock-list.png",
    width: 1817,
    height: 771,
    module: "Inventory",
    view: "Stock list",
    focus: "left top",
  },
  {
    src: "/images/shared/product-screens/orders.png",
    width: 1803,
    height: 759,
    module: "Sales & POS",
    view: "Orders",
    focus: "left top",
  },
  {
    src: "/images/shared/product-screens/purchases.png",
    width: 1645,
    height: 685,
    module: "Procurement",
    view: "Purchase orders",
    focus: "left top",
  },
  {
    src: "/images/shared/product-screens/series-ledger.png",
    width: 1587,
    height: 878,
    module: "Inventory",
    view: "Series ledger",
    focus: "left top",
  },
  {
    src: "/images/shared/product-screens/barcodes.png",
    width: 1229,
    height: 771,
    module: "Inventory",
    view: "Barcode queue",
    focus: "left top",
  },
];

/** Rows are offset against each other so the same screen never stacks up. */
const rows = [
  { offset: 0, duration: 96, reverse: false },
  { offset: 3, duration: 124, reverse: true },
  { offset: 1, duration: 84, reverse: false },
  { offset: 4, duration: 138, reverse: true },
  { offset: 2, duration: 108, reverse: false },
] as const;

/** Enough repeats that one half always overruns the widest stage. */
const CARDS_PER_HALF = 8;

function buildRow(offset: number): Screen[] {
  return Array.from(
    { length: CARDS_PER_HALF },
    (_, index) => screens[(index + offset) % screens.length],
  );
}

function ScreenCard({ screen, eager }: { screen: Screen; eager: boolean }) {
  return (
    <figure className={styles.productMarquee__card}>
      <span className={styles.productMarquee__chrome}>
        <span className={styles.productMarquee__dots} />
        <span className={styles.productMarquee__chromeLabel}>
          {screen.module}
          <i>/</i>
          {screen.view}
        </span>
      </span>
      <span className={styles.productMarquee__shot}>
        <Image
          className={styles.productMarquee__shotImage}
          style={{ objectPosition: screen.focus }}
          src={screen.src}
          width={screen.width}
          height={screen.height}
          alt=""
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 900px) 320px, 480px"
        />
      </span>
    </figure>
  );
}

function MarqueeRow({
  offset,
  duration,
  reverse,
  eager,
}: {
  offset: number;
  duration: number;
  reverse: boolean;
  eager: boolean;
}) {
  const cards = buildRow(offset);

  return (
    <div className={styles.productMarquee__row}>
      <div
        className={reverse ? `${styles.productMarquee__track} ${styles.productMarquee__reverse}` : styles.productMarquee__track}
        style={{ "--duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((half) => (
          <div className={styles.productMarquee__half} key={half}>
            {cards.map((screen, index) => (
              <ScreenCard
                key={`${half}-${screen.src}-${index}`}
                screen={screen}
                eager={eager && half === 0 && index < screens.length}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductMarquee() {
  return (
    <div className={styles.productMarquee__scene} aria-hidden="true">
      <div className={styles.productMarquee__marquee}>
        <div className={styles.productMarquee__stage}>
          {rows.map((row, index) => (
            <MarqueeRow key={row.offset} {...row} eager={index === 0} />
          ))}
        </div>
      </div>
      <span className={styles.productMarquee__scrim} />
      <span className={styles.productMarquee__tint} />
      <span className={styles.productMarquee__edges} />
      <span className={styles.productMarquee__grain} />
    </div>
  );
}
