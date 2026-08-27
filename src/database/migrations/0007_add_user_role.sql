-- Add role column to user table for RBAC
-- Default 'user' ensures existing rows get a valid role
ALTER TABLE "user" ADD COLUMN "role" text NOT NULL DEFAULT 'user';