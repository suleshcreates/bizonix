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
      className="inline-flex items-center gap-2 lg:gap-3"
    >
      <Image
        src="/images/shared/brand/icon.svg"
        alt=""
        width={compact ? 36 : 42}
        height={compact ? 36 : 42}
        className={
          compact ? "size-9" : "size-[34px] lg:size-[42px]"
        }
        priority
      />
      <span
        className={`text-lg font-extrabold tracking-[-.04em] lg:text-xl ${light ? "text-white" : "text-bz-navy"}`}
      >
        Bizonix
      </span>
    </Link>
  );
}
