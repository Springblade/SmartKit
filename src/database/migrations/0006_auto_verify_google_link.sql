-- Auto-verify email when user links a Google account
-- Google already verified the email, so we trust it
CREATE OR REPLACE FUNCTION mark_user_email_verified_on_google_link()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.provider_id = 'google' THEN
    UPDATE "user" SET email_verified = true WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mark_email_verified_on_google_link
AFTER INSERT ON "account"
FOR EACH ROW
EXECUTE FUNCTION mark_user_email_verified_on_google_link();
