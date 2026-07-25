-- Supabase-only baseline.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'IronLog User',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_name text not null, sets integer not null check (sets > 0),
  reps integer not null check (reps > 0), weight numeric not null check (weight >= 0),
  workout_date date not null, created_at timestamptz not null default now()
);
create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Workout', workout_date date not null,
  created_at timestamptz not null default now()
);
create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_name text not null, exercise_order integer not null check (exercise_order > 0),
  sets integer not null check (sets > 0), reps integer not null check (reps > 0),
  weight numeric not null check (weight >= 0), created_at timestamptz not null default now(),
  unique (session_id, exercise_order)
);
create table if not exists public.workout_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_name text not null, sets integer not null check (sets > 0),
  reps integer not null check (reps > 0), weight numeric not null check (weight >= 0),
  workout_date date not null, caption text,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_at timestamptz not null default now()
);
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, created_at timestamptz not null default now()
);

create index if not exists workouts_user_date_idx on public.workouts (user_id, workout_date desc, created_at desc);
create index if not exists workout_sessions_user_date_idx on public.workout_sessions (user_id, workout_date desc, created_at desc);
create index if not exists workout_exercises_session_order_idx on public.workout_exercises (session_id, exercise_order);
create index if not exists workout_posts_public_created_idx on public.workout_posts (created_at desc) where visibility = 'public';

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'IronLog User'))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill only missing profiles; do not rewrite any existing profile or FK.
insert into public.profiles (id, username)
select u.id, coalesce(nullif(trim(u.raw_user_meta_data ->> 'username'), ''),
  nullif(split_part(coalesce(u.email, ''), '@', 1), ''), 'IronLog User')
from auth.users u on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.workouts enable row level security;
alter table public.workouts force row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_sessions force row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_exercises force row level security;
alter table public.workout_posts enable row level security;
alter table public.workout_posts force row level security;
alter table public.exercises enable row level security;
alter table public.exercises force row level security;

-- Remove every legacy policy first: permissive policies are OR-combined.
do $$
declare policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles', 'workouts', 'workout_sessions',
        'workout_exercises', 'workout_posts', 'exercises'
      )
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_row.policyname, policy_row.schemaname, policy_row.tablename
    );
  end loop;
end;
$$;

drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read" on public.profiles for select to anon, authenticated using (true);
drop policy if exists "profiles_owner_update" on public.profiles;
create policy "profiles_owner_update" on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "workouts_owner_select" on public.workouts;
create policy "workouts_owner_select" on public.workouts for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "workouts_owner_insert" on public.workouts;
create policy "workouts_owner_insert" on public.workouts for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "workouts_owner_update" on public.workouts;
create policy "workouts_owner_update" on public.workouts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "workouts_owner_delete" on public.workouts;
create policy "workouts_owner_delete" on public.workouts for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "sessions_owner_all" on public.workout_sessions;
create policy "sessions_owner_all" on public.workout_sessions for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "session_exercises_owner_select" on public.workout_exercises;
create policy "session_exercises_owner_select" on public.workout_exercises for select to authenticated
using (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = (select auth.uid())));
drop policy if exists "session_exercises_owner_insert" on public.workout_exercises;
create policy "session_exercises_owner_insert" on public.workout_exercises for insert to authenticated
with check (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = (select auth.uid())));
drop policy if exists "session_exercises_owner_update" on public.workout_exercises;
create policy "session_exercises_owner_update" on public.workout_exercises for update to authenticated
using (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = (select auth.uid())))
with check (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = (select auth.uid())));
drop policy if exists "session_exercises_owner_delete" on public.workout_exercises;
create policy "session_exercises_owner_delete" on public.workout_exercises for delete to authenticated
using (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = (select auth.uid())));

drop policy if exists "posts_public_or_owner_select" on public.workout_posts;
create policy "posts_public_or_owner_select" on public.workout_posts for select to anon, authenticated
using (visibility = 'public' or (select auth.uid()) = user_id);
drop policy if exists "posts_owner_insert" on public.workout_posts;
create policy "posts_owner_insert" on public.workout_posts for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "posts_owner_update" on public.workout_posts;
create policy "posts_owner_update" on public.workout_posts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "posts_owner_delete" on public.workout_posts;
create policy "posts_owner_delete" on public.workout_posts for delete to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "exercises_public_read" on public.exercises;
create policy "exercises_public_read" on public.exercises for select to anon, authenticated using (true);

-- Restrict profiles to public fields even when its SELECT policy passes.
revoke all on public.profiles from anon, authenticated;
grant select (id, username) on public.profiles to anon, authenticated;
grant update (username) on public.profiles to authenticated;
grant select on public.exercises to anon, authenticated;
grant select, insert, update, delete on public.workouts, public.workout_sessions, public.workout_exercises to authenticated;
grant select on public.workout_posts to anon;
grant select, insert, update, delete on public.workout_posts to authenticated;

create or replace function public.get_workout_leaderboard()
returns table (user_id uuid, username text, workout_count bigint, total_volume numeric)
language sql stable security definer set search_path = ''
as $$
  select p.id, p.username, count(w.id),
    coalesce(sum(w.sets * w.reps * w.weight), 0)
  from public.profiles p left join public.workouts w on w.user_id = p.id
  group by p.id, p.username;
$$;
revoke all on function public.get_workout_leaderboard() from public;
grant execute on function public.get_workout_leaderboard() to anon, authenticated;
