-- Profile Cleanup Migration

-- Drop unused columns
ALTER TABLE profiles
DROP COLUMN IF EXISTS website,
DROP COLUMN IF EXISTS username;

-- Rename full_name to name
ALTER TABLE profiles
RENAME COLUMN full_name TO name;

-- Update handle_new_user to use new column name
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
