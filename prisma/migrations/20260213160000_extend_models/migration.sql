-- Add github_login to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "github_login" TEXT;

-- Add item ownership + share link
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "share_link" TEXT;

-- Purchase enrichment
ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "buyer_user_id" TEXT;
ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "seller_github_login" TEXT;
ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "price_paid" DECIMAL(10,2);
ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "status" TEXT;
ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "payment_method" TEXT;
ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "payment_reference" TEXT;

-- Backfill defaults
UPDATE "purchases" SET "status" = 'CONFIRMED' WHERE "status" IS NULL;

-- Enums (Prisma)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PurchaseStatus') THEN
    CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'CANCELED');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentMethod') THEN
    CREATE TYPE "PaymentMethod" AS ENUM ('PIX');
  END IF;
END$$;

ALTER TABLE "purchases"
  ALTER COLUMN "status" TYPE "PurchaseStatus" USING ("status"::"PurchaseStatus");

ALTER TABLE "purchases"
  ALTER COLUMN "payment_method" TYPE "PaymentMethod" USING ("payment_method"::"PaymentMethod");

-- Constraints / indexes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'items_user_id_fkey'
  ) THEN
    ALTER TABLE "items"
      ADD CONSTRAINT "items_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'purchases_buyer_user_id_fkey'
  ) THEN
    ALTER TABLE "purchases"
      ADD CONSTRAINT "purchases_buyer_user_id_fkey"
      FOREIGN KEY ("buyer_user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

CREATE UNIQUE INDEX IF NOT EXISTS "users_github_login_key" ON "users"("github_login");
