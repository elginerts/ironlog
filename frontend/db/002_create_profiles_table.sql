-- Create profiles table to store username + tag for social features
-- Each profile is owned by an auth user (user_id references auth.users)
-- We enforce uniqueness of (username, tag) so users can be discovered via username#tag

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  tag text not null,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ensure username+tag combinations are unique
create unique index if not exists idx_profiles_username_tag on public.profiles (lower(username), tag);

-- Enable RLS and policies so users can insert/select/update their own profile
alter table public.profiles enable row level security;

-- Allow users to insert or update their own profile
create policy "profiles_user_is_owner" on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow anonymous select of username/tag for discovery if desired.
-- If you want discovery only for logged-in users, restrict accordingly.
create policy "profiles_public_select" on public.profiles
  for select
  using (true);
