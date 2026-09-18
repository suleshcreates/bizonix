"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hasWhatsApp, siteConfig } from "@/lib/site-config";

export function StickyCTA() {
  const pathname = usePathname();
  // On /contact the page itself is the CTA; a second one competes with it.
  if (pathname === "/contact") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bz-border/80 bg-white/90 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-10px_30px_rgba(11,31,58,.08)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2.5">
        <Link
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-bz-blue px-5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(47,107,255,.9)] transition active:scale-[.98]"
          href="/contact"
        >
          Book a demo
          <ArrowRight size={16} strokeWidth={2.4} />
        </Link>
        {hasWhatsApp && (
          <Link
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-bz-border bg-white text-bz-navy transition active:scale-95"
            aria-label="Contact Bizonix on WhatsApp"
            href={siteConfig.whatsappUrl}
          >
            <MessageCircle size={20} />
          </Link>
        )}
      </div>
    </div>
  );
}
