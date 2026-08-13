import Link from "next/link";
import type { ReactNode } from "react";

const styles = {
  primary:
    "bg-bz-blue text-white hover:bg-bz-blue-hover shadow-[0_12px_30px_rgba(47,107,255,.22)]",
  secondary:
    "border border-bz-border bg-white text-bz-navy hover:border-bz-blue hover:text-bz-blue",
  ghost: "text-bz-navy hover:bg-bz-surface-alt",
  light: "bg-white text-bz-navy hover:bg-bz-blue-soft",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
