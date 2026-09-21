-- Demo-request communications and core enquiry tables
-- Creates EnquiryStatus, EnquiryPriority, and enquiries tables if not present,
-- then provisions enquiry_emails, enquiry_notes, and enquiry_activities.

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EnquiryStatus') THEN
    CREATE TYPE "EnquiryStatus" AS ENUM (
      'NEW', 'CONTACTED', 'QUALIFIED', 'DEMO_SCHEDULED', 'DEMO_COMPLETED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED', 'SPAM'
    );
  ELSE
    ALTER TYPE "EnquiryStatus" ADD VALUE IF NOT EXISTS 'CONVERTED';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EnquiryPriority') THEN
    CREATE TYPE "EnquiryPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "enquiries" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "outlet_count" TEXT,
    "current_software" TEXT,
    "role" TEXT,
    "industry" TEXT,
    "priorities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "timeline" TEXT,
    "intent" TEXT DEFAULT 'Book a Demo',
    "source" TEXT DEFAULT 'Website',
    "page" TEXT DEFAULT '/contact',
    "message" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "priority" "EnquiryPriority" NOT NULL DEFAULT 'MEDIUM',
    "lead_score" INTEGER NOT NULL DEFAULT 0,
    "assigned_to_id" TEXT,
    "next_action" TEXT,
    "demo_date" TIMESTAMP(3),
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "enquiries_status_idx" ON "enquiries"("status");
CREATE INDEX IF NOT EXISTS "enquiries_priority_idx" ON "enquiries"("priority");
CREATE INDEX IF NOT EXISTS "enquiries_assigned_to_id_idx" ON "enquiries"("assigned_to_id");
CREATE INDEX IF NOT EXISTS "enquiries_created_at_idx" ON "enquiries"("created_at");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enquiries_assigned_to_id_fkey') THEN
    ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_id_fkey"
      FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EnquiryEmailDirection') THEN
    CREATE TYPE "EnquiryEmailDirection" AS ENUM ('OUTBOUND', 'INBOUND');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EnquiryEmailDeliveryStatus') THEN
    CREATE TYPE "EnquiryEmailDeliveryStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "enquiry_emails" (
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

CREATE INDEX IF NOT EXISTS "enquiry_emails_enquiry_id_created_at_idx" ON "enquiry_emails"("enquiry_id", "created_at");
CREATE INDEX IF NOT EXISTS "enquiry_emails_delivery_status_idx" ON "enquiry_emails"("delivery_status");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enquiry_emails_enquiry_id_fkey') THEN
    ALTER TABLE "enquiry_emails" ADD CONSTRAINT "enquiry_emails_enquiry_id_fkey"
      FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enquiry_emails_sender_user_id_fkey') THEN
    ALTER TABLE "enquiry_emails" ADD CONSTRAINT "enquiry_emails_sender_user_id_fkey"
      FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "enquiry_notes" (
    "id" TEXT NOT NULL,
    "enquiry_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiry_notes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "enquiry_notes_enquiry_id_idx" ON "enquiry_notes"("enquiry_id");
CREATE INDEX IF NOT EXISTS "enquiry_notes_author_id_idx" ON "enquiry_notes"("author_id");
CREATE INDEX IF NOT EXISTS "enquiry_notes_created_at_idx" ON "enquiry_notes"("created_at");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enquiry_notes_enquiry_id_fkey') THEN
    ALTER TABLE "enquiry_notes" ADD CONSTRAINT "enquiry_notes_enquiry_id_fkey"
      FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enquiry_notes_author_id_fkey') THEN
    ALTER TABLE "enquiry_notes" ADD CONSTRAINT "enquiry_notes_author_id_fkey"
      FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "enquiry_activities" (
    "id" TEXT NOT NULL,
    "enquiry_id" TEXT NOT NULL,
    "actor_id" TEXT,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiry_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "enquiry_activities_enquiry_id_idx" ON "enquiry_activities"("enquiry_id");
CREATE INDEX IF NOT EXISTS "enquiry_activities_created_at_idx" ON "enquiry_activities"("created_at");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enquiry_activities_enquiry_id_fkey') THEN
    ALTER TABLE "enquiry_activities" ADD CONSTRAINT "enquiry_activities_enquiry_id_fkey"
      FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enquiry_activities_actor_id_fkey') THEN
    ALTER TABLE "enquiry_activities" ADD CONSTRAINT "enquiry_activities_actor_id_fkey"
      FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
