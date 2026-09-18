import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { exploreAllModulesRoute } from "@/lib/content/modules/modules";
import styles from "@/components/pages/home/home.module.css";

/**
 * The section's single CTA, centred at the bottom of the composition.
 * Revealed only once the system has assembled.
 */
export function ModuleCTA() {
  return (
    <div className={styles.moduleShowcase__ctaWrap} data-ms-cta>
      <ButtonLink href={exploreAllModulesRoute} className={styles.moduleShowcase__cta}>
        Explore All Modules <ArrowRight size={16} strokeWidth={2.4} aria-hidden />
      </ButtonLink>
    </div>
  );
}
