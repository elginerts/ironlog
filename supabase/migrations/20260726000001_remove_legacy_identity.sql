-- Remove the final legacy identity field after switching fully to Supabase Auth.
alter table public.profiles drop column if exists firebase_uid;
