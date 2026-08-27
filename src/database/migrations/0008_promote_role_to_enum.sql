-- Promote 'role' column from text to user_role enum.
-- The Drizzle schema declares `userRoleEnum` but earlier migrations
-- (0007_add_user_role.sql) added the column as plain text. This migration
-- brings the DB into sync with the Drizzle type definition.
--
-- Safe because existing rows only contain 'user' or 'admin' (the default
-- from 0007 and the only manually-promoted value).
CREATE TYPE "public"."user_role" AS ENUM ('user', 'admin');

ALTER TABLE "public"."user"
  ALTER COLUMN "role" TYPE "public"."user_role"
  USING "role"::"public"."user_role";