-- Connect feed posts to completed sessions and add social interactions.

alter table public.workout_posts
  add column if not exists session_id uuid
  references public.workout_sessions(id) on delete cascade;

alter table public.workout_posts
  alter column exercise_name drop not null,
  alter column sets drop not null,
  alter column reps drop not null,
  alter column weight drop not null;

create unique index if not exists workout_posts_session_unique
  on public.workout_posts (session_id)
  where session_id is not null;

create table if not exists public.post_likes (
  post_id uuid not null references public.workout_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.workout_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (
    char_length(trim(body)) between 1 and 500
  ),
  created_at timestamptz not null default now()
);

create index if not exists post_comments_post_created_idx
  on public.post_comments (post_id, created_at);

alter table public.post_likes enable row level security;
alter table public.post_likes force row level security;
alter table public.post_comments enable row level security;
alter table public.post_comments force row level security;

create or replace function public.owns_workout_session(target_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workout_sessions session
    where session.id = target_session_id
      and session.user_id = auth.uid()
  );
$$;
revoke all on function public.owns_workout_session(uuid) from public;
grant execute on function public.owns_workout_session(uuid) to authenticated;

drop policy if exists "posts_owner_insert" on public.workout_posts;
create policy "posts_owner_insert"
  on public.workout_posts for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      session_id is null
      or (select public.owns_workout_session(session_id))
    )
  );

drop policy if exists "posts_owner_update" on public.workout_posts;
create policy "posts_owner_update"
  on public.workout_posts for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (
      session_id is null
      or (select public.owns_workout_session(session_id))
    )
  );

drop policy if exists "public_post_sessions_select"
  on public.workout_sessions;
create policy "public_post_sessions_select"
  on public.workout_sessions for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.workout_posts post
      where post.session_id = workout_sessions.id
        and post.visibility = 'public'
    )
  );

drop policy if exists "public_post_exercises_select"
  on public.workout_exercises;
create policy "public_post_exercises_select"
  on public.workout_exercises for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.workout_sessions session
      join public.workout_posts post on post.session_id = session.id
      where session.id = workout_exercises.session_id
        and post.visibility = 'public'
    )
  );

drop policy if exists "visible_post_likes_select" on public.post_likes;
create policy "visible_post_likes_select"
  on public.post_likes for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.workout_posts post
      where post.id = post_likes.post_id
        and (
          post.visibility = 'public'
          or post.user_id = (select auth.uid())
        )
    )
  );

drop policy if exists "users_like_as_themselves" on public.post_likes;
create policy "users_like_as_themselves"
  on public.post_likes for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.workout_posts post
      where post.id = post_likes.post_id
        and post.visibility = 'public'
    )
  );

drop policy if exists "users_remove_their_likes" on public.post_likes;
create policy "users_remove_their_likes"
  on public.post_likes for delete
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "visible_post_comments_select" on public.post_comments;
create policy "visible_post_comments_select"
  on public.post_comments for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.workout_posts post
      where post.id = post_comments.post_id
        and (
          post.visibility = 'public'
          or post.user_id = (select auth.uid())
        )
    )
  );

drop policy if exists "users_comment_as_themselves" on public.post_comments;
create policy "users_comment_as_themselves"
  on public.post_comments for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.workout_posts post
      where post.id = post_comments.post_id
        and post.visibility = 'public'
    )
  );

drop policy if exists "users_remove_their_comments" on public.post_comments;
create policy "users_remove_their_comments"
  on public.post_comments for delete
  to authenticated
  using (user_id = (select auth.uid()));

grant select on public.post_likes, public.post_comments to anon;
grant select, insert, delete
  on public.post_likes, public.post_comments to authenticated;
