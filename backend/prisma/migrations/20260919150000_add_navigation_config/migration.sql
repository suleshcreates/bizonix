-- CreateTable
CREATE TABLE IF NOT EXISTS "navigation_configs" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "announcement" JSONB NOT NULL DEFAULT '{}',
    "header" JSONB NOT NULL DEFAULT '{}',
    "megaMenu" JSONB NOT NULL DEFAULT '{}',
    "footer" JSONB NOT NULL DEFAULT '{}',
    "footerCta" JSONB NOT NULL DEFAULT '{}',
    "bottomBar" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_configs_pkey" PRIMARY KEY ("id")
);
