import Image from "next/image";
import {
  HERO_FRAME_ASPECT,
  projectOntoFrame,
} from "@/lib/content/modules/module-pages/frame-geometry";
import type { ModuleHeroData } from "@/lib/content/modules/module-pages/types";
import { getProductScreen } from "@/lib/content/modules/module-pages/product-screens";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The hero product canvas.
 *
 * Two states, chosen by data — never by slug:
 *
 *  • a module with a captured screen shows the real screen on a flat product
 *    canvas (no laptop, phone, tilt or 3D frame), annotated against regions
 *    that are genuinely in the frame, with its operating chain as a rail
 *    underneath;
 *  • a module without one draws the chain itself as an explicit diagram,
 *    labelled as a diagram. Nothing is invented to fill the space.
 *
 * The chain is what makes nine heroes read differently while sharing one
 * layout: Inventory shows piece → entry → location → count, Accounting shows
 * operation → journal → ledger → report, and so on.
 *
 * Annotations are one list in the DOM, laid out two ways. On a wide viewport
 * each note floats beside its anchor on the canvas, joined by a 1px leader; on
 * a narrow one the same elements fall into a numbered list under the canvas.
 * Nothing is duplicated for the second layout, so a screen reader hears each
 * note exactly once and the numbers always agree with the dots.
 */
export function HeroStage({ hero }: { hero: ModuleHeroData }) {
  if (!hero.screen) {
    return (
      <div className={styles.modulePage__schematic} data-variant={hero.visualVariant}>
        <span className={styles.modulePage__schematicGrid} aria-hidden="true" />
        <div className={styles.modulePage__schematicRow}>
          {hero.chain.map((node, index) => (
            <div key={node.id}>
              <div className={styles.modulePage__schematicNode}>
                <span className={styles.modulePage__schematicIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{node.label}</strong>
                  <span>{node.detail}</span>
                </span>
              </div>
              {index < hero.chain.length - 1 ? (
                <span className={styles.modulePage__schematicLink} aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
        <p className={styles.modulePage__schematicNote}>
          Diagram of the operating chain — not a product screen. Captures for
          this module are pending.
        </p>
      </div>
    );
  }

  const screen = getProductScreen(hero.screen.id);

  /* Authored against the capture; projected through the hero crop before it is
     drawn. A note the crop has removed is dropped rather than clamped to an
     edge — validation fails the build on one, so this is belt and braces. */
  const notes = (hero.screen.annotations ?? []).flatMap((note) => {
    const at = projectOntoFrame(hero.screen!.id, HERO_FRAME_ASPECT, note);
    return at ? [{ ...note, at }] : [];
  });

  return (
    <div className={styles.modulePage__stage}>
      <figure className={styles.modulePage__canvas}>
        <figcaption className={styles.modulePage__canvasRail}>
          <span className={styles.modulePage__canvasName}>
            <i aria-hidden="true" />
            {screen.screen}
          </span>
          <span className={styles.modulePage__canvasTag}>Product screen</span>
        </figcaption>
        {/* Positioning context for the notes: exactly the image box, so a
            note's `top` is the same per-cent the projection produced. */}
        <div className={styles.modulePage__canvasBody}>
          <div
            className={styles.modulePage__canvasViewport}
            style={
              {
                "--focus": hero.screen.focus ?? "left top",
              } as React.CSSProperties
            }
          >
            <Image
              src={screen.src}
              alt={hero.screen.alt}
              fill
              preload
              sizes="(max-width: 1080px) 92vw, 620px"
            />
            <span className={styles.modulePage__canvasFade} aria-hidden="true" />

            {notes.map((note, index) => (
              <span
                key={note.id}
                className={styles.modulePage__anchor}
                style={
                  {
                    left: `${note.at.x}%`,
                    top: `${note.at.y}%`,
                  } as React.CSSProperties
                }
                aria-hidden="true"
              >
                {index + 1}
              </span>
            ))}
          </div>

          {notes.length > 0 ? (
            <ol className={styles.modulePage__notes} aria-label="What this screen shows">
              {notes.map((note, index) => (
                <li
                  key={note.id}
                  className={styles.modulePage__note}
                  data-side={note.side}
                  style={
                    {
                      "--note-x": `${note.at.x}%`,
                      "--note-y": `${note.at.y}%`,
                    } as React.CSSProperties
                  }
                >
                  <span className={styles.modulePage__noteMark}>{index + 1}</span>
                  <span className={styles.modulePage__noteBody}>
                    <strong>{note.label}</strong>
                    <span>{note.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </figure>

      <ul className={styles.modulePage__chain} aria-label="Operating chain">
        {hero.chain.map((node) => (
          <li key={node.id} className={styles.modulePage__chainNode}>
            <strong>{node.label}</strong>
            <span>{node.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
