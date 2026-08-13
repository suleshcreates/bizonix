import { ArrowRight, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function FinalCTA() {
  return (
    <section className="section blue-grid bg-bz-blue-soft">
      <div className="shell text-center">
        <span className="eyebrow">Bring the real workflow</span>
        <h2 className="h2 mx-auto mt-5 max-w-4xl">
          Run wholesale, retail and franchise as one business—not three
          disconnected tools.
        </h2>
        <p className="lede mx-auto mt-6 max-w-2xl">
          Show us how stock moves today. We’ll show you where Bizonix creates
          one operating truth.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/contact">
            Book a demo <ArrowRight size={17} />
          </ButtonLink>
          <ButtonLink href={siteConfig.whatsappUrl} variant="secondary">
            <MessageCircle size={17} /> WhatsApp us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
