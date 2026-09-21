-- AlterTable: remove plaintext initial_password column for security (BIZ-SEC-003)
ALTER TABLE "users" DROP COLUMN IF EXISTS "initial_password";
