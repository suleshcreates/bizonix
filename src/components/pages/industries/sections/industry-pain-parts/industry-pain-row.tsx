import { ArrowDownRight, Gem, Network, Shirt } from "lucide-react";
import type { IndustryPainStory } from "@/lib/content/industries/industry-pain-data";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustryCollapsedImage } from "./industry-collapsed-image";
import { IndustryDetailImage } from "./industry-detail-image";
import { IndustryPainList } from "./industry-pain-list";
import { IndustryResponse } from "./industry-response";

const icons = { apparel: Shirt, jewellery: Gem, franchise: Network } as const;

export function IndustryPainRow({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: IndustryPainStory;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = icons[item.id];
  const detailId = `industry-pain-${item.id}`;

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  }

  return (
    <div
      className={`${styles.industryPainSection__story} ${styles["industryPainSection__" + (item.accent)]} ${isOpen ? styles.industryPainSection__isOpen : ""}`}
      style={{ "--row-index": index } as React.CSSProperties}
    >
      <div className={styles.industryPainSection__summary}>
        <div className={styles.industryPainSection__summaryClip}>
          <div
            className={styles.industryPainSection__row}
            role="button"
            tabIndex={isOpen ? -1 : 0}
            aria-expanded={isOpen}
            aria-controls={detailId}
            aria-label={`${item.name}: ${isOpen ? "close pain story" : "open pain story"}`}
            onClick={onToggle}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.industryPainSection__identity}>
              <span className={styles.industryPainSection__number}>{item.number}</span>
              <Icon aria-hidden="true" size={19} strokeWidth={1.7} />
              <h3>{item.name}</h3>
            </div>
            <IndustryCollapsedImage item={item} priority={index === 0} />
            <div className={styles.industryPainSection__pressureCell}>
              <div className={styles.industryPainSection__bottleneck}>
                <span className={styles.industryPainSection__microLabel}>The pressure</span>
                <strong>{item.pressure}</strong>
                <p>{item.pressureDetail}</p>
              </div>
              <span className={styles.industryPainSection__transition} aria-hidden="true">
                <i /><i /><i /><i /><b /><em />
              </span>
            </div>
            <IndustryResponse item={item} />
            <ArrowDownRight className={styles.industryPainSection__rowArrow} aria-hidden="true" size={20} />
          </div>
        </div>
      </div>

      <div className={styles.industryPainSection__expansion} id={detailId} aria-hidden={!isOpen}>
        <div className={styles.industryPainSection__expansionClip}>
          <div className={styles.industryPainSection__expandedStory}>
            <div className={styles.industryPainSection__expandedImageRegion}>
              <IndustryCollapsedImage item={item} expandedLayer />
              <IndustryDetailImage item={item} />
            </div>
            <div className={styles.industryPainSection__storyContent}>
              <div className={styles.industryPainSection__storyIdentity}>
                <span>{item.number}</span>
                <Icon aria-hidden="true" size={17} strokeWidth={1.7} />
                <strong>{item.name}</strong>
              </div>
              <span className={styles.industryPainSection__microLabel}>Operational pressure</span>
              <h4>{item.pressure}</h4>
              <p>{item.pressureDetail}</p>
              <IndustryPainList pains={item.pains} />
            </div>
            <div className={styles.industryPainSection__responseColumn}>
              <button
                type="button"
                className={styles.industryPainSection__closeControl}
                tabIndex={isOpen ? 0 : -1}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggle();
                }}
              >
                Close <span aria-hidden="true">↑</span>
              </button>
              <IndustryResponse item={item} expanded />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
