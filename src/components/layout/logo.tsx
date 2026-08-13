import Image from "next/image";
import Link from "next/link";

export function Logo({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Bizonix home"
      className="inline-flex items-center gap-3"
    >
      <Image
        src="/brand/icon.svg"
        alt=""
        width={compact ? 36 : 42}
        height={compact ? 36 : 42}
        priority
      />
      <span
        className={`text-xl font-extrabold tracking-[-.04em] ${light ? "text-white" : "text-bz-navy"}`}
      >
        Bizonix
      </span>
    </Link>
  );
}
