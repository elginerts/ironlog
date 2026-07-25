# Supabase setup

Back up production, then apply the migration with `supabase db push` or the SQL
editor. Configure each app from its checked-in `.env.example`; the service-role
key belongs only on the backend.

The migrations configure the schema, Supabase Auth profile trigger, grants, and
Row Level Security policies.

After rollout, compare these counts with the backup:

```sql
select 'profiles' entity, count(*) from public.profiles
union all select 'workout_sessions', count(*) from public.workout_sessions
union all select 'workout_exercises', count(*) from public.workout_exercises
union all select 'workout_posts', count(*) from public.workout_posts;
```

## Starting from an empty application

`scripts/reset_all_users.sql` permanently removes all Auth users, profiles,
workouts, sessions, posts, and exercise suggestions. It is intentionally not a
migration, because routine deployments must never erase application data.

Back up first, then run the script once in the Supabase SQL Editor. Every user
will need to register again afterward.
