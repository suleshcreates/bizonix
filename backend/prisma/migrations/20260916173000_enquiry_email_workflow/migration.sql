-- Demo-request communications are stored with their delivery result so the
-- admin console is an operational record, not an inbox mock-up.
ALTER TYPE "EnquiryStatus" ADD VALUE IF NOT EXISTS 'CONVERTED';

CREATE TYPE "EnquiryEmailDirection" AS ENUM ('OUTBOUND', 'INBOUND');
CREATE TYPE "EnquiryEmailDeliveryStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED');

CREATE TABLE "enquiry_emails" (
    "id" TEXT NOT NULL,
    "enquiry_id" TEXT NOT NULL,
    "sender_user_id" TEXT,
    "direction" "EnquiryEmailDirection" NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "provider_id" TEXT,
    "delivery_status" "EnquiryEmailDeliveryStatus" NOT NULL DEFAULT 'QUEUED',
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiry_emails_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "enquiry_emails_enquiry_id_created_at_idx" ON "enquiry_emails"("enquiry_id", "created_at");
CREATE INDEX "enquiry_emails_delivery_status_idx" ON "enquiry_emails"("delivery_status");

ALTER TABLE "enquiry_emails" ADD CONSTRAINT "enquiry_emails_enquiry_id_fkey"
  FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "enquiry_emails" ADD CONSTRAINT "enquiry_emails_sender_user_id_fkey"
  FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
