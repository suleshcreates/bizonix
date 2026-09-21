-- AlterTable partners
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'Technology Partner';
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "website_url" TEXT;
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "partners_sort_order_idx" ON "partners"("sort_order");

-- Seed Initial Canonical Enterprise Partners
INSERT INTO "partners" ("id", "name", "slug", "category", "logo_url", "website_url", "description", "sort_order", "is_featured", "is_published", "created_at", "updated_at")
VALUES
  ('partner-1', 'Razorpay', 'razorpay', 'Payments & Checkout', '', 'https://razorpay.com', 'Omnichannel payment gateway and POS reconciliation', 0, true, true, NOW(), NOW()),
  ('partner-2', 'Pine Labs', 'pine-labs', 'Hardware & POS Terminals', '', 'https://pinelabs.com', 'Smart android EDC card machines and retail payment terminals', 1, true, true, NOW(), NOW()),
  ('partner-3', 'Delhivery', 'delhivery', 'Logistics & 3PL', '', 'https://delhivery.com', 'Automated surface dispatch, express courier, and nationwide freight', 2, true, true, NOW(), NOW()),
  ('partner-4', 'Amazon Web Services', 'aws', 'Cloud Infrastructure', '', 'https://aws.amazon.com', 'Enterprise multi-AZ cloud hosting and auto-scaling computing', 3, true, true, NOW(), NOW()),
  ('partner-5', 'SAP ERP', 'sap', 'Enterprise Systems', '', 'https://sap.com', 'Two-way financial ledgers and materials management integration', 4, true, true, NOW(), NOW()),
  ('partner-6', 'Salesforce', 'salesforce', 'CRM & Service Cloud', '', 'https://salesforce.com', 'Customer lifecycle, omnichannel lead tracking, and loyalty sync', 5, true, true, NOW(), NOW()),
  ('partner-7', 'Stripe', 'stripe', 'Global Payments', '', 'https://stripe.com', 'Cross-border multi-currency billing and subscription management', 6, true, true, NOW(), NOW()),
  ('partner-8', 'Shiprocket', 'shiprocket', 'Fulfillment & Hyperlocal', '', 'https://shiprocket.in', 'Multi-carrier logistics allocation and same-day city deliveries', 7, true, true, NOW(), NOW()),
  ('partner-9', 'Zoho Books', 'zoho', 'Accounting & Tax', '', 'https://zoho.com', 'Automated GST filing and statutory compliance registers', 8, true, true, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
