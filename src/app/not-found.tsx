import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
export default function NotFound() {
  return (
    <section className="blue-grid flex min-h-[72vh] items-center bg-bz-surface-alt py-20">
      <div className="shell text-center">
        <div className="mx-auto flex w-fit">
          <Logo />
        </div>
        <p className="mt-10 text-xs font-extrabold uppercase tracking-[.2em] text-bz-blue">
          404 · Phase 2 is still taking shape
        </p>
        <h1 className="h2 mx-auto mt-5 max-w-3xl">
          This part of the operating map isn’t live yet.
        </h1>
        <p className="lede mx-auto mt-5 max-w-xl">
          Some solution and industry pages are intentionally reserved for the
          next build phase. The core platform and demo flow are ready.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-bz-border bg-white px-6 text-sm font-bold"
          >
            <ArrowLeft size={17} /> Back home
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-bz-blue px-6 text-sm font-bold text-white"
          >
            Book a demo <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
