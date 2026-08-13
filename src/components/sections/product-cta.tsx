import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
export function ProductCTA() {
  return (
    <section className="section blue-grid bg-bz-blue-soft">
      <div className="shell text-center">
        <span className="eyebrow">
          See the operating model on your business
        </span>
        <h2 className="h2 mx-auto mt-5 max-w-3xl">
          Bring the workflow. Leave with a clearer system map.
        </h2>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/contact">
            Book a demo <ArrowRight size={17} />
          </ButtonLink>
          <ButtonLink href="/modules" variant="secondary">
            Explore modules
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
