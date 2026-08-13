import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Privacy policy (Draft)",
  description:
    "Draft privacy structure for the Bizonix website, pending legal review.",
};
export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      sections={[
        {
          heading: "Information we collect",
          body: "We may collect information you submit through the demo request form, including contact, company and workflow details. Final wording, retention periods and lawful bases remain subject to legal review.",
        },
        {
          heading: "How information is used",
          body: "Demo-lead information is intended to help Fibonce respond to enquiries, understand product fit and arrange follow-up. Production analytics and marketing use must be documented before launch.",
        },
        {
          heading: "Cookies and analytics",
          body: "Essential website functionality may use limited technical storage. Any production analytics, consent controls or advertising technologies must be listed here once confirmed.",
        },
        {
          heading: "Sharing and retention",
          body: "Final policy must describe service providers used for hosting, email delivery and analytics, as well as access controls and retention practices.",
        },
        {
          heading: "Your choices",
          body: "The production policy will explain how individuals can request access, correction or deletion, subject to applicable law and operational obligations.",
        },
      ]}
    />
  );
}
