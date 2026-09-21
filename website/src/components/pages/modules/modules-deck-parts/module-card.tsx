import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import type {
  ModuleIndexItem,
  SerializableModuleIndexItem,
} from "@/lib/content/modules/modules-index";
import { resolveModuleIcon } from "@/lib/content/modules/module-resolver";
import { ModuleVisual } from "./module-visuals";
import styles from "@/components/pages/modules/modules.module.css";

type Props = {
  module: SerializableModuleIndexItem | ModuleIndexItem;
  /** Position in the full catalogue, not in the filtered view. */
  number: number;
  register: (slug: string, element: HTMLElement | null) => void;
};

/**
 * One module bay: a live simulation on top, the reading matter below.
 *
 * The pointer drives four custom properties (`--mx/--my` for the spotlight,
 * `--rx/--ry` for a very shallow tilt) through a single rAF, so moving across
 * the deck never writes style more than once a frame.
 */
export function ModuleCard({ module, number, register }: Props) {
  const Icon = module.icon || resolveModuleIcon(module.iconKey);
  const elementRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef(0);
  const pointRef = useRef({ x: 0, y: 0 });

  const setRef = useCallback(
    (element: HTMLElement | null) => {
      elementRef.current = element;
      register(module.slug, element);
    },
    [register, module.slug],
  );

  const paint = useCallback(() => {
    frameRef.current = 0;
    const element = elementRef.current;
    if (!element) return;
    const { x, y } = pointRef.current;
    element.style.setProperty("--mx", `${x * 100}%`);
    element.style.setProperty("--my", `${y * 100}%`);
    element.style.setProperty("--rx", `${(0.5 - y) * 4.5}deg`);
    element.style.setProperty("--ry", `${(x - 0.5) * 5.5}deg`);
  }, []);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const element = elementRef.current;
      if (!element || event.pointerType === "touch") return;
      const bounds = element.getBoundingClientRect();
      pointRef.current = {
        x: (event.clientX - bounds.left) / bounds.width,
        y: (event.clientY - bounds.top) / bounds.height,
      };
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(paint);
      }
    },
    [paint],
  );

  const handleLeave = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return (
    <article
      ref={setRef}
      className={styles.moduleCard__card}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={
        {
          "--accent": module.accent,
          "--accent-dark": module.accentDark,
        } as CSSProperties
      }
    >
      <span className={styles.moduleCard__spot} aria-hidden="true" />
      <span className={styles.moduleCard__edge} aria-hidden="true" />

      <div className={styles.moduleCard__visual}>
        <span className={styles.moduleCard__mesh} aria-hidden="true" />
        <ModuleVisual slug={module.slug} />
        <span className={styles.moduleCard__serial} aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
        <span className={styles.moduleCard__outcome}>{module.outcome}</span>
      </div>

      <div className={styles.moduleCard__body}>
        <div className={styles.moduleCard__heading}>
          <span className={styles.moduleCard__icon} aria-hidden="true">
            <Icon size={19} strokeWidth={1.9} />
          </span>
          <h3>{module.title}</h3>
        </div>

        <p className={styles.moduleCard__summary}>{module.summary}</p>

        <ul
          className={styles.moduleCard__capabilities}
          aria-label={`${module.title} capabilities`}
        >
          {module.capabilities.map((capability, index) => (
            <li key={capability} style={{ "--c": index } as CSSProperties}>
              {capability}
            </li>
          ))}
        </ul>
      </div>

      <Link className={styles.moduleCard__explore} href={`/modules/${module.slug}`}>
        <span>Explore {module.title}</span>
        <span className={styles.moduleCard__arrow} aria-hidden="true">
          <ArrowRight size={15} strokeWidth={2.4} />
        </span>
      </Link>
    </article>
  );
}
