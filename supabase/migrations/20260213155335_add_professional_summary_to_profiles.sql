-- Migration to add professional_summary to profiles table

ALTER TABLE profiles
ADD COLUMN professional_summary TEXT;

COMMENT ON COLUMN profiles.professional_summary IS 'A brief professional summary or biography of the user.';
