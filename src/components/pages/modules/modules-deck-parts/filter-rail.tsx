import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  moduleFilterAccents,
  moduleFilters,
  type ModuleFilter,
} from "@/lib/content/modules/modules-index";
import styles from "@/components/pages/modules/modules.module.css";

type Props = {
  active: ModuleFilter;
  counts: Record<ModuleFilter, number>;
  total: number;
  onSelect: (filter: ModuleFilter) => void;
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** A single odometer wheel; the column slides, the digit never re-renders. */
function Wheel({ digit }: { digit: number }) {
  return (
    <span className={styles.filterRail__wheel} aria-hidden="true">
      <span
        className={styles.filterRail__wheelTrack}
        style={{ transform: `translateY(${-digit * 10}%)` }}
      >
        {DIGITS.map((value) => (
          <span key={value}>{value}</span>
        ))}
      </span>
    </span>
  );
}

function Odometer({ value }: { value: number }) {
  const safe = Math.min(Math.max(value, 0), 99);
  return (
    <span className={styles.filterRail__odometer}>
      <Wheel digit={Math.floor(safe / 10)} />
      <Wheel digit={safe % 10} />
    </span>
  );
}

/**
 * The function selector.
 *
 * The active state is a single travelling pill rather than nine independent
 * backgrounds — it measures the pressed button and glides, stretching slightly
 * in the direction of travel the way a physical selector would.
 */
export function FilterRail({ active, counts, total, onSelect }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef(new Map<ModuleFilter, HTMLButtonElement>());
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const measure = useCallback(() => {
    const button = buttonsRef.current.get(active);
    if (!button) return;
    setPill({ x: button.offsetLeft, w: button.offsetWidth });
  }, [active]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  // A short stretch-and-settle on every hop, on top of the CSS glide.
  useEffect(() => {
    const pillElement = pillRef.current;
    if (!pillElement || !pill) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pillElement.animate(
      [
        { transform: "scaleX(1) scaleY(1)" },
        { transform: "scaleX(1.14) scaleY(0.9)", offset: 0.35 },
        { transform: "scaleX(1) scaleY(1)" },
      ],
      { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [active, pill]);

  return (
    <div className={styles.filterRail__rail}>
      <p className={styles.filterRail__label}>
        <span className={styles.filterRail__labelDot} aria-hidden="true" />
        Filter by business function
      </p>

      <div
        className={styles.filterRail__track}
        ref={trackRef}
        role="group"
        aria-label="Module filters"
      >
        {pill ? (
          <span
            className={styles.filterRail__pillHolder}
            aria-hidden="true"
            style={
              {
                transform: `translateX(${pill.x}px)`,
                width: `${pill.w}px`,
                "--chip": moduleFilterAccents[active],
              } as CSSProperties
            }
          >
            <span className={styles.filterRail__pill} ref={pillRef} />
          </span>
        ) : null}

        {moduleFilters.map((filter) => (
          <button
            key={filter.id}
            ref={(element) => {
              if (element) buttonsRef.current.set(filter.id, element);
              else buttonsRef.current.delete(filter.id);
            }}
            type="button"
            className={styles.filterRail__chip}
            aria-pressed={active === filter.id}
            onClick={() => onSelect(filter.id)}
            style={
              { "--chip": moduleFilterAccents[filter.id] } as CSSProperties
            }
          >
            <span className={styles.filterRail__chipDot} aria-hidden="true" />
            {filter.label}
            <span className={styles.filterRail__chipCount} aria-hidden="true">
              {counts[filter.id]}
            </span>
          </button>
        ))}
      </div>

      <p className={styles.filterRail__meter}>
        <span className={styles.filterRail__srOnly} aria-live="polite">
          Showing {counts[active]} of {total} modules
        </span>
        <span aria-hidden="true" className={styles.filterRail__meterInner}>
          <Odometer value={counts[active]} />
          <span className={styles.filterRail__meterSlash}>/</span>
          <Odometer value={total} />
          <span className={styles.filterRail__meterWord}>modules</span>
        </span>
      </p>
    </div>
  );
}
