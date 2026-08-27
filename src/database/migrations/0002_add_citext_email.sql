-- Apply citext to email column for case-insensitive uniqueness
ALTER TABLE "user" ALTER COLUMN email TYPE citext;
ALTER TABLE "user" ADD CONSTRAINT user_email_unique UNIQUE (email);
