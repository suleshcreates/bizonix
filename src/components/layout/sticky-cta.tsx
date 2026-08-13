import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bz-border bg-white/95 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(11,31,58,.08)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        <Link
          className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-bz-blue px-5 text-sm font-bold text-white"
          href="/contact"
        >
          Book a demo
        </Link>
        <Link
          className="flex size-12 items-center justify-center rounded-full border border-bz-border text-bz-navy"
          aria-label="Contact Bizonix on WhatsApp"
          href={siteConfig.whatsappUrl}
        >
          <MessageCircle size={20} />
        </Link>
      </div>
    </div>
  );
}
