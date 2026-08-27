-- Migration: Add features field to plans table
-- This column stores the feature list for each pricing plan as a PostgreSQL text array.

ALTER TABLE "plans" ADD COLUMN "features" text[] NOT NULL DEFAULT '{}'::text[];
