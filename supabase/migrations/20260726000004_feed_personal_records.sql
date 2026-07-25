-- Store whether a shared workout contained a personal record.
alter table public.workout_posts
  add column if not exists has_personal_record boolean
  not null default false;
