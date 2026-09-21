-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ModuleStatus') THEN
    CREATE TYPE "ModuleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ModuleThemeKey') THEN
    CREATE TYPE "ModuleThemeKey" AS ENUM ('CYAN', 'ORANGE', 'CORAL', 'EMERALD', 'BLUE', 'PURPLE', 'PINK', 'INDIGO', 'SLATE');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ModuleIconKey') THEN
    CREATE TYPE "ModuleIconKey" AS ENUM ('BOXES', 'TRUCK', 'SCAN_BARCODE', 'BUILDING', 'STORE', 'CALCULATOR', 'SHOPPING_BAG', 'BAR_CHART', 'SHIELD_CHECK', 'LAYERS', 'CPU', 'WORKFLOW', 'DATABASE', 'ZAP');
  END IF;
END $$;

-- Ensure FaqLocation exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FaqLocation') THEN
    CREATE TYPE "FaqLocation" AS ENUM ('HOME', 'BOOK_DEMO', 'MODULE');
  ELSE
    ALTER TYPE "FaqLocation" ADD VALUE IF NOT EXISTS 'MODULE';
  END IF;
END $$;

-- Ensure faq_categories exists
CREATE TABLE IF NOT EXISTS "faq_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" "FaqLocation" NOT NULL DEFAULT 'HOME',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faq_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "faq_categories_slug_key" ON "faq_categories"("slug");
CREATE INDEX IF NOT EXISTS "faq_categories_location_sort_order_idx" ON "faq_categories"("location", "sort_order");

-- Ensure faq_items exists
CREATE TABLE IF NOT EXISTS "faq_items" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "tag" TEXT,
    "location" "FaqLocation" NOT NULL DEFAULT 'HOME',
    "category_id" TEXT,
    "module_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "faq_items_location_is_published_sort_order_idx" ON "faq_items"("location", "is_published", "sort_order");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_items_category_id_fkey') THEN
    ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_category_id_fkey"
      FOREIGN KEY ("category_id") REFERENCES "faq_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "module_items" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "theme_key" "ModuleThemeKey" NOT NULL DEFAULT 'BLUE',
    "icon_key" "ModuleIconKey" NOT NULL DEFAULT 'BOXES',
    "badge" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "ModuleStatus" NOT NULL DEFAULT 'DRAFT',
    "ever_published" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "content_version" INTEGER NOT NULL DEFAULT 1,
    "show_in_catalog" BOOLEAN NOT NULL DEFAULT true,
    "show_in_mega_menu" BOOLEAN NOT NULL DEFAULT false,
    "show_in_homepage" BOOLEAN NOT NULL DEFAULT false,
    "show_in_footer" BOOLEAN NOT NULL DEFAULT false,
    "content" JSONB NOT NULL DEFAULT '{}',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "module_items_slug_key" ON "module_items"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "module_items_status_sort_order_idx" ON "module_items"("status", "sort_order");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "module_items_category_idx" ON "module_items"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "faq_items_module_id_idx" ON "faq_items"("module_id");

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'faq_items_module_id_fkey'
  ) THEN
    ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
