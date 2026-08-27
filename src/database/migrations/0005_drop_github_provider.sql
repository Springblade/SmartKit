-- Remove unused 'github' value from provider enum.
-- The Better Auth config only wires Google OAuth, so 'github' was dead weight.
-- Requires Postgres >= 10 (ALTER TYPE ... DROP VALUE).
ALTER TYPE "public"."provider" DROP VALUE IF EXISTS 'github';