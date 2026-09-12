import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * The quiet sphere on the left.
 *
 * Geometry and rendering are split deliberately. CSS sizes and positions a
 * square element in vw, which is what keeps the body a true circle at every
 * viewport; the SVG inside draws the volume in its own 1000×1000 space, where
 * the body is a circle of r=440 at (500,500) and the remaining 60 units are
 * the atmosphere's room to fall off. A single hero-wide SVG cannot do both:
 * any `preserveAspectRatio` that keeps the circles circular either crops both
 * spheres out of frame on a phone or distorts them into ellipses on a wide
 * monitor.
 *
 * The volume is the point, and it does not come from the surface lines. It
 * comes from one radial gradient whose focal point sits off-centre, just
 * inside the lit limb, so brightness falls away from that point in every
 * direction rather than across a straight axis. Remove every line below and
 * the sphere still reads as a sphere; that is the test this layer has to pass.
 *
 * Light for the whole hero comes from the middle of the scene, so this sphere
 * is lit on its right — the side facing the copy, and the only side on screen.
 */

/* Latitudes on a sphere tilted 20° out of the viewing plane: ry is rx·sin(20°)
   and each ring's centre rides up the axis by R·sin(φ)·cos(20°). They are not
   evenly spaced on screen, because circles of latitude are not evenly spaced
   in projection — that unevenness is most of what makes the set read as a
   surface rather than as a stack of ellipses. */
const LATITUDES = [
  { rx: 220, ry: 75, cy: 858, o: 0.3 },
  { rx: 337, ry: 115, cy: 766, o: 0.44 },
  { rx: 413, ry: 141, cy: 641, o: 0.58 },
  { rx: 440, ry: 150, cy: 500, o: 0.72 },
  { rx: 413, ry: 141, cy: 359, o: 0.64 },
  { rx: 337, ry: 115, cy: 234, o: 0.46 },
  { rx: 220, ry: 75, cy: 142, o: 0.3 },
];

/* Meridians share the pole-to-pole vertical extent (R·cos(20°)) and differ
   only in width, down to one seen edge-on. */
const MERIDIANS = [
  { rx: 405, o: 0.4 },
  { rx: 300, o: 0.3 },
  { rx: 165, o: 0.22 },
  { rx: 35, o: 0.18 },
];

export function HeroSphereLeft() {
  return (
    <svg
      className={styles.pricing__sphereLeft}
      viewBox="0 0 1000 1000"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Body. The focal point is at (600, 330), deep in the half that never
            reaches the frame, so the crescent on screen is entirely falloff:
            brightest where it emerges from behind the viewport edge, dimming
            as the surface turns away toward the limb. Put the focal inside the
            visible crescent instead and the sphere reads as a lit panel. */}
        <radialGradient
          id="ph-l-body"
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="500"
          r="560"
          fx="560"
          fy="330"
        >
          <stop offset="0" stopColor="#2f6199" stopOpacity="0.44" />
          <stop offset="0.24" stopColor="#1d446f" stopOpacity="0.34" />
          <stop offset="0.5" stopColor="#102845" stopOpacity="0.22" />
          <stop offset="0.76" stopColor="#091a2e" stopOpacity="0.12" />
          <stop offset="1" stopColor="#061426" stopOpacity="0" />
        </radialGradient>

        {/* Silhouette softening. Nothing in this sphere may end on a hard
            circular edge, so the body is masked to nothing across the outer
            18% of its radius. */}
        <radialGradient
          id="ph-l-fade"
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
          id="ph-l-bodymask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1000"
          height="1000"
        >
          <circle cx="500" cy="500" r="470" fill="url(#ph-l-fade)" />
        </mask>

        {/* Atmosphere: a broad haze that peaks outside the body and is gone by
            the edge of the box. Wide and weak on purpose — a narrow band here
            reads as a drawn ring around a circle. */}
        <radialGradient
          id="ph-l-atmo"
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="500"
          r="500"
        >
          <stop offset="0.55" stopColor="#2f6bff" stopOpacity="0" />
          <stop offset="0.86" stopColor="#2f6bff" stopOpacity="0.045" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </radialGradient>

        {/* Surface lines inherit the lighting rather than a flat opacity: this
            mask is centred on the same focal point as the body, so a line
            fades as it travels into the unlit hemisphere and disappears
            entirely before the far limb. */}
        <radialGradient
          id="ph-l-lit"
          gradientUnits="userSpaceOnUse"
          cx="560"
          cy="330"
          r="620"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.78" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask
          id="ph-l-litmask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1000"
          height="1000"
        >
          <circle cx="500" cy="500" r="440" fill="url(#ph-l-lit)" />
        </mask>

        {/* Limb darkening — the layer that actually sells the curve. A sphere
            is darker where its surface angles away from the viewer, and
            without that trough the body just fades out with no edge to read
            as a silhouette. Transparent through the middle, a soft dark band
            just inside the rim, gone again by the edge. */}
        <radialGradient
          id="ph-l-limb"
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="500"
          r="440"
        >
          <stop offset="0.6" stopColor="#020a16" stopOpacity="0" />
          <stop offset="0.88" stopColor="#020a16" stopOpacity="0.3" />
          <stop offset="1" stopColor="#020a16" stopOpacity="0" />
        </radialGradient>

        {/* Where the light grazes: off the upper-right shoulder, so the
            highlight fades out well before the limb nears the headline. */}
        <radialGradient
          id="ph-l-graze"
          gradientUnits="userSpaceOnUse"
          cx="880"
          cy="250"
          r="470"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="0.78" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask
          id="ph-l-rimmask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1000"
          height="1000"
        >
          <circle cx="500" cy="500" r="500" fill="url(#ph-l-graze)" />
        </mask>

        <clipPath id="ph-l-clip">
          <circle cx="500" cy="500" r="440" />
        </clipPath>
      </defs>

      <circle cx="500" cy="500" r="500" fill="url(#ph-l-atmo)" />
      <g mask="url(#ph-l-bodymask)">
        <circle cx="500" cy="500" r="470" fill="url(#ph-l-body)" />
        <circle cx="500" cy="500" r="440" fill="url(#ph-l-limb)" />
      </g>

      <g
        clipPath="url(#ph-l-clip)"
        mask="url(#ph-l-litmask)"
        fill="none"
        stroke="#8fb6ff"
        strokeWidth="1"
        opacity="0.46"
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

      <circle
        cx="500"
        cy="500"
        r="440"
        fill="none"
        stroke="#8ab2ee"
        strokeWidth="1.3"
        strokeOpacity="0.34"
        mask="url(#ph-l-rimmask)"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
