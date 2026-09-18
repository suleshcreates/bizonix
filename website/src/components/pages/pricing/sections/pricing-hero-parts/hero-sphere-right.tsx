import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * The lit sphere on the right.
 *
 * Same construction as the left one — CSS owns the circle, the SVG owns the
 * volume — mirrored, because the scene's light sits between the two spheres:
 * this body is lit on its left, which is the side that reaches the viewport.
 *
 * Three things are here that the left sphere does not have.
 *
 * A rim. It is a stroke on the body circle, and its brightness along the limb
 * is set by a mask centred just outside the upper-left shoulder, so the light
 * rises and falls around the curve instead of ringing it evenly. A uniform
 * stroke on a circle is a drawn outline; a masked one is a lit edge.
 *
 * A halo. The same annulus at a fraction of the opacity and many times the
 * width, built from gradient stops rather than a blur filter — a filter over
 * an element this large is the most expensive thing on the page, and stops
 * give the same falloff for nothing.
 *
 * A signal. It rides `#ph-r-track`, which is not a path drawn for it: that
 * element is the equator, one of this sphere's seven latitudes, stroked as a
 * visible surface line and used as the motion path in the same breath. The dot
 * therefore travels the curved surface rather than the screen — and because
 * the curve is an ellipse in projection, it slows through the limb and
 * quickens across the face on its own, with no easing anywhere.
 */

const LATITUDES = [
  { rx: 220, ry: 75, cy: 858, o: 0.3 },
  { rx: 337, ry: 115, cy: 766, o: 0.44 },
  { rx: 413, ry: 141, cy: 641, o: 0.58 },
  { rx: 413, ry: 141, cy: 359, o: 0.64 },
  { rx: 337, ry: 115, cy: 234, o: 0.46 },
  { rx: 220, ry: 75, cy: 142, o: 0.3 },
];

const MERIDIANS = [
  { rx: 405, o: 0.4 },
  { rx: 300, o: 0.3 },
  { rx: 165, o: 0.22 },
  { rx: 35, o: 0.18 },
];

/* The equator, written as arcs so it can carry the signal. It belongs to the
   same latitude family as the six above and is pulled out only because
   `<animateMotion>` needs a `<path>` rather than an `<ellipse>` — the ring is
   stroked as a visible surface line and used as the motion path in one go.
   The widest latitude is also the one that reaches furthest past the viewport
   edge, which is what gives the signal a run long enough to read as travel. */
const TRACK = "M 60 500 A 440 150 0 1 1 940 500 A 440 150 0 1 1 60 500";

export function HeroSphereRight() {
  return (
    <svg
      className={styles.pricing__sphereRight}
      viewBox="0 0 1000 1000"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient
          id="ph-r-body"
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="500"
          r="560"
          fx="400"
          fy="330"
        >
          <stop offset="0" stopColor="#39719f" stopOpacity="0.46" />
          <stop offset="0.22" stopColor="#204a78" stopOpacity="0.36" />
          <stop offset="0.48" stopColor="#112a4a" stopOpacity="0.23" />
          <stop offset="0.75" stopColor="#091a2e" stopOpacity="0.12" />
          <stop offset="1" stopColor="#061426" stopOpacity="0" />
        </radialGradient>

        <radialGradient
          id="ph-r-fade"
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="500"
          r="470"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.78" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask
          id="ph-r-bodymask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1000"
          height="1000"
        >
          <circle cx="500" cy="500" r="470" fill="url(#ph-r-fade)" />
        </mask>

        <radialGradient
          id="ph-r-atmo"
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="500"
          r="500"
        >
          <stop offset="0.55" stopColor="#2f6bff" stopOpacity="0" />
          <stop offset="0.86" stopColor="#4a86ff" stopOpacity="0.055" />
          <stop offset="1" stopColor="#4a86ff" stopOpacity="0" />
        </radialGradient>

        {/* Where the light grazes. Centred outside the body on the upper-left
            shoulder, high enough that the bright stretch of limb sits in the
            corner above the headline rather than beside it. */}
        <radialGradient
          id="ph-r-graze"
          gradientUnits="userSpaceOnUse"
          cx="95"
          cy="235"
          r="540"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="0.76" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask
          id="ph-r-rimmask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1000"
          height="1000"
        >
          <circle cx="500" cy="500" r="500" fill="url(#ph-r-graze)" />
        </mask>

        {/* Limb darkening — the layer that actually sells the curve. A sphere
            is darker where its surface angles away from the viewer, and
            without that trough the body just fades out with no edge to read
            as a silhouette. Transparent through the middle, a soft dark band
            just inside the rim, gone again by the edge. */}
        <radialGradient
          id="ph-r-limb"
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="500"
          r="440"
        >
          <stop offset="0.6" stopColor="#020a16" stopOpacity="0" />
          <stop offset="0.88" stopColor="#020a16" stopOpacity="0.32" />
          <stop offset="1" stopColor="#020a16" stopOpacity="0" />
        </radialGradient>

        {/* The halo's radial profile: nothing until well outside the body, a
            peak just past the rim, gone by the edge of the box. */}
        <radialGradient
          id="ph-r-halo"
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="500"
          r="500"
        >
          <stop offset="0.72" stopColor="#7dadff" stopOpacity="0" />
          <stop offset="0.88" stopColor="#7dadff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#45e3cf" stopOpacity="0" />
        </radialGradient>

        <radialGradient
          id="ph-r-lit"
          gradientUnits="userSpaceOnUse"
          cx="400"
          cy="330"
          r="620"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.78" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask
          id="ph-r-litmask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1000"
          height="1000"
        >
          <circle cx="500" cy="500" r="440" fill="url(#ph-r-lit)" />
        </mask>

        <clipPath id="ph-r-clip">
          <circle cx="500" cy="500" r="440" />
        </clipPath>
      </defs>

      <circle cx="500" cy="500" r="500" fill="url(#ph-r-atmo)" />
      <g mask="url(#ph-r-bodymask)">
        <circle cx="500" cy="500" r="470" fill="url(#ph-r-body)" />
        <circle cx="500" cy="500" r="440" fill="url(#ph-r-limb)" />
      </g>

      <g
        clipPath="url(#ph-r-clip)"
        mask="url(#ph-r-litmask)"
        fill="none"
        stroke="#9cc2ff"
        strokeWidth="1"
        opacity="0.5"
        vectorEffect="non-scaling-stroke"
      >
        {LATITUDES.map((l) => (
          <ellipse
            key={`lat-${l.cy}`}
            cx="500"
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            strokeOpacity={l.o}
          />
        ))}
        <path id="ph-r-track" d={TRACK} strokeOpacity="0.64" />
        {MERIDIANS.map((m) => (
          <ellipse
            key={`mer-${m.rx}`}
            cx="500"
            cy="500"
            rx={m.rx}
            ry="414"
            strokeOpacity={m.o}
          />
        ))}
      </g>

      {/* Halo first, then the rim inside it: the wide diffuse field is what
          reads as atmosphere, and the thin stroke is what reads as the edge. */}
      <circle
        cx="500"
        cy="500"
        r="500"
        fill="url(#ph-r-halo)"
        mask="url(#ph-r-rimmask)"
      />
      <circle
        cx="500"
        cy="500"
        r="440"
        fill="none"
        stroke="#bcd9ff"
        strokeWidth="1.6"
        strokeOpacity="0.7"
        mask="url(#ph-r-rimmask)"
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath="url(#ph-r-clip)" className={styles.pricing__signalGroup}>
        <circle r="9" fill="#7dadff" opacity="0.22">
          <animateMotion dur="14s" repeatCount="indefinite" path={TRACK} />
        </circle>
        <circle r="3" fill="#d8ecff" opacity="0.9">
          <animateMotion dur="14s" repeatCount="indefinite" path={TRACK} />
        </circle>
      </g>
    </svg>
  );
}
