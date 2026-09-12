import { ImageResponse } from "next/og";

/**
 * The shared Open Graph card.
 *
 * The site previously pointed `og:image` at an SVG. Facebook, LinkedIn and X
 * all refuse SVG, so every share of every page rendered a blank card. This
 * draws the same composition as a real PNG through Satori, which is the only
 * format those crawlers accept.
 *
 * Rendered at build time by the `opengraph-image` file convention, so the tags
 * — including `og:image:width` and `og:image:height` — are emitted by Next
 * itself and cannot drift from the file. Satori supports flexbox only, no grid.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const NAVY = "#0b1f3a";
const BLUE = "#2f6bff";
const TEAL = "#2ec4b6";
const MUTED = "#5b6b7c";

/** The Bizonix mark, drawn inline — Satori cannot fetch an external asset. */
function Mark({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 9 53 21 32 33 11 21 32 9Z" fill={BLUE} />
      <path d="M11 21 32 33v22L11 43V21Z" fill={NAVY} />
      <path d="M53 21 32 33v22l21-12V21Z" fill={TEAL} />
      <path d="M23 26.5 32 21l9 5.5-9 5.5-9-5.5Z" fill="#fff" fillOpacity=".9" />
    </svg>
  );
}

/**
 * One card, two lines of type over the brand ground.
 *
 * `eyebrow` names the section ("Solutions", "Features"), `title` is the page's
 * own social headline and `description` its supporting line.
 */
export function ogImage(options: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f7fb",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* The angled band from the brand's own social plate. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 260,
            background: "#eaf0ff",
            transform: "skewY(-6deg)",
            transformOrigin: "bottom left",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Mark />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: NAVY,
                letterSpacing: -1,
              }}
            >
              Bizonix
            </div>
            {options.eyebrow ? (
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 600,
                  color: BLUE,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {options.eyebrow}
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              color: NAVY,
              lineHeight: 1.12,
              letterSpacing: -1.8,
              maxWidth: 1000,
            }}
          >
            {options.title}
          </div>
          <div
            style={{
              fontSize: 27,
              color: MUTED,
              lineHeight: 1.4,
              maxWidth: 940,
            }}
          >
            {options.description}
          </div>
          <div
            style={{
              width: 168,
              height: 8,
              borderRadius: 4,
              background: TEAL,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
