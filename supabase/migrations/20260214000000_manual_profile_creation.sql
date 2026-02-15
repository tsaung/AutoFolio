-- Migration to manual profile creation and stricter constraints

-- 1. Drop the trigger that automatically creates profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the function used by the trigger
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. CRITICAL: Delete incomplete profiles to force re-onboarding
--    We define "incomplete" as missing essential fields that we are about to make NOT NULL
DELETE FROM profiles 
WHERE profession IS NULL 
   OR field IS NULL 
   OR name IS NULL;

-- 4. Add NOT NULL constraints to enforce data quality
--    name is already checked above, but good to be explicit
ALTER TABLE profiles
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN profession SET NOT NULL,
ALTER COLUMN field SET NOT NULL,
ALTER COLUMN experience SET DEFAULT 0,
ALTER COLUMN experience SET NOT NULL,
ALTER COLUMN welcome_message SET NOT NULL,
ALTER COLUMN professional_summary SET NOT NULL;

-- 5. Ensure constraints are valid (though the DELETE above should ensure this)
--    If for some reason a row slips through (unlikely with DELETE), this ALTER will fail, which is good.
