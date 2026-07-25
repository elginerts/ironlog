-- DANGER: Irreversibly deletes every IronLog user and all application data.
-- This is a manual administrative reset, not a migration. Back up first.

begin;

delete from public.workout_exercises;
delete from public.workout_sessions;
delete from public.workout_posts;
delete from public.workouts;
delete from public.exercises;
delete from public.profiles;
delete from auth.users;

commit;

-- These should all return zero.
select 'auth.users' as entity, count(*) from auth.users
union all select 'profiles', count(*) from public.profiles
union all select 'workouts', count(*) from public.workouts
union all select 'workout_sessions', count(*) from public.workout_sessions
union all select 'workout_exercises', count(*) from public.workout_exercises
union all select 'workout_posts', count(*) from public.workout_posts
union all select 'exercises', count(*) from public.exercises;
