
-- Create bot_configs table
create table bot_configs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('public_agent', 'admin_agent')),
  provider text not null default 'openrouter',
  model text not null default 'google/gemini-2.0-flash-001',
  system_prompt text,
  predefined_prompts jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),

  -- Ensure one config per type per user
  unique(user_id, type)
);

-- Enable RLS
alter table bot_configs enable row level security;

-- Policies
create policy "Users can view own bot config." on bot_configs
  for select using (auth.uid() = user_id);

create policy "Users can update own bot config." on bot_configs
  for update using (auth.uid() = user_id);

create policy "Users can insert own bot config." on bot_configs
  for insert with check (auth.uid() = user_id);

-- Allow public access to 'public_agent' config ONLY (needed for chat interface)
create policy "Public can view public_agent config." on bot_configs
  for select using (type = 'public_agent');

-- Drop old system_settings table
drop table if exists system_settings;
