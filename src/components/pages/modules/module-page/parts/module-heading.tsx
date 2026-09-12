import type { CSSProperties } from "react";
import styles from "@/components/pages/modules/modules.module.css";

const authoredAccents: Readonly<Record<string, string>> = {
  "Where stock counts lose the truth.": "lose the truth.",
  "Where purchases lose their trail.": "lose their trail.",
  "Where counter days stop closing.": "stop closing.",
  "Where bulk orders lose their shape.": "lose their shape.",
  "Where networks lose visibility.": "lose visibility.",
  "Where online stock drifts apart.": "drifts apart.",
  "Where reports arrive too late.": "arrive too late.",
  "Where access loses its boundaries.": "loses its boundaries.",
  "Where books lose the day.": "lose the day.",

  "How stock actually moves": "actually moves",
  "From commitment to shelf": "to shelf",
  "A sale, end to end": "end to end",
  "From order to dispatch": "to dispatch",
  "How the network operates": "network operates",
  "From an operating event to a statement": "to a statement",
  "From catalogue to delivered order": "delivered order",
  "From an operating record to a decision": "to a decision",
  "How access is decided": "access is decided",
};

function splitHeading(text: string, accent: string) {
  const accentIndex = text.lastIndexOf(accent);
  if (accentIndex < 0) return { base: text, accent: "" };

  return {
    base: text.slice(0, accentIndex).trimEnd(),
    accent,
  };
}

export function ModuleHeading({
  id,
  text,
  accent = authoredAccents[text] ?? "",
  className,
  style,
  reveal = true,
}: {
  id: string;
  text: string;
  accent?: string;
  className?: string;
  style?: CSSProperties;
  reveal?: boolean;
}) {
  const parts = splitHeading(text, accent);

  return (
    <h2
      id={id}
      className={className}
      style={style}
      data-reveal={reveal ? "" : undefined}
    >
      {parts.base}
      {parts.accent ? (
        <>
          {" "}
          <span className={styles.modulePage__headingAccent}>
            {parts.accent}
          </span>
        </>
      ) : null}
    </h2>
  );
}
