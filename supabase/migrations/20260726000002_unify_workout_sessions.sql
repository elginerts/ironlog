-- Make workout_sessions/workout_exercises the single workout data model.
-- Preserve each legacy workout as a one-exercise session before removing the
-- redundant table.

drop function if exists public.get_workout_leaderboard();

do $$
begin
  if to_regclass('public.workouts') is not null then
    insert into public.workout_sessions (
      id, user_id, title, workout_date, created_at
    )
    select id, user_id, exercise_name, workout_date, created_at
    from public.workouts
    on conflict (id) do nothing;

    insert into public.workout_exercises (
      session_id, exercise_name, exercise_order, sets, reps, weight, created_at
    )
    select
      workout.id, workout.exercise_name, 1, workout.sets, workout.reps,
      workout.weight, workout.created_at
    from public.workouts workout
    where not exists (
      select 1
      from public.workout_exercises exercise
      where exercise.session_id = workout.id
    );

    drop table public.workouts;
  end if;
end;
$$;

create or replace function public.get_workout_leaderboard()
returns table (
  user_id uuid,
  username text,
  workout_count bigint,
  total_volume numeric
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    profile.id,
    profile.username,
    count(distinct session.id),
    coalesce(sum(exercise.sets * exercise.reps * exercise.weight), 0)
  from public.profiles profile
  left join public.workout_sessions session on session.user_id = profile.id
  left join public.workout_exercises exercise
    on exercise.session_id = session.id
  group by profile.id, profile.username;
$$;

revoke all on function public.get_workout_leaderboard() from public;
grant execute on function public.get_workout_leaderboard()
  to anon, authenticated;
