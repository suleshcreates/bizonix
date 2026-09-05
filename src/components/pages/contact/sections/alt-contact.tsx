"use client";

import { Mail, MessageCircle } from "lucide-react";
import { altContact } from "@/lib/content/contact/contact-content";
import { hasSalesEmail, hasWhatsApp, siteConfig } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import styles from "@/components/pages/contact/contact.module.css";

/**
 * Escape routes, not primary CTAs — deliberately below the form and styled at a
 * lower weight than the submit button.
 */
export function AltContact() {
  if (!hasWhatsApp && !hasSalesEmail) return null;

  const whatsappHref = siteConfig.whatsappUrl.includes("wa.me")
    ? `${siteConfig.whatsappUrl}?text=${encodeURIComponent(altContact.whatsappMessage)}`
    : siteConfig.whatsappUrl;

  return (
    <section className={styles.contact__alt} aria-labelledby="alt-title">
      <div>
        <h2 id="alt-title">{altContact.title}</h2>
        <p>{altContact.body}</p>
      </div>
      <div
        className={styles.contact__altActions}
        data-single={hasWhatsApp !== hasSalesEmail || undefined}
      >
        {hasWhatsApp && (
          <a
            href={whatsappHref}
            className={`${styles.contact__altLink} ${styles.contact__altWhatsapp}`}
            onClick={() =>
              track("contact_whatsapp_clicked", { placement: "alt-contact" })
            }
          >
            <MessageCircle size={32} strokeWidth={1.6} aria-hidden="true" />
            <strong>Message us on WhatsApp</strong>
            <small>Fastest for a quick question</small>
          </a>
        )}
        {hasSalesEmail && (
          <a
            href={`mailto:${siteConfig.salesEmail}`}
            className={`${styles.contact__altLink} ${styles.contact__altEmail}`}
            onClick={() =>
              track("contact_email_clicked", { placement: "alt-contact" })
            }
          >
            <Mail size={32} strokeWidth={1.6} aria-hidden="true" />
            <strong>Email us directly</strong>
            <small>{siteConfig.salesEmail}</small>
          </a>
        )}
      </div>
    </section>
  );
}
