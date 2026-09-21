-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'IndustryStatus') THEN
    CREATE TYPE "IndustryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'IndustryAccent') THEN
    CREATE TYPE "IndustryAccent" AS ENUM ('BLUE', 'TEAL', 'VIOLET');
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "industry_items" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "accent" "IndustryAccent" NOT NULL DEFAULT 'BLUE',
    "badge" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "IndustryStatus" NOT NULL DEFAULT 'DRAFT',
    "ever_published" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "content_version" INTEGER NOT NULL DEFAULT 1,
    "show_in_overview" BOOLEAN NOT NULL DEFAULT true,
    "show_in_mega_menu" BOOLEAN NOT NULL DEFAULT false,
    "show_in_homepage" BOOLEAN NOT NULL DEFAULT false,
    "show_in_footer" BOOLEAN NOT NULL DEFAULT false,
    "content" JSONB NOT NULL DEFAULT '{}',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "industry_items_slug_key" ON "industry_items"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "industry_items_status_sort_order_idx" ON "industry_items"("status", "sort_order");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "industry_items_category_idx" ON "industry_items"("category");
