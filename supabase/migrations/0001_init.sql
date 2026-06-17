-- 0001_init.sql
-- Run this once in your Supabase project: Dashboard → SQL Editor → paste → Run.
-- (Or via the Supabase CLI if you use it.)
--
-- It creates two tables and turns on Row Level Security (RLS).
--
-- WHY RLS MATTERS: RLS makes the DATABASE ITSELF refuse to return another
-- user's rows — even if your app code has a bug. You never rely on the app to
-- "remember to filter". Postgres enforces ownership on every query.
-- Rule for this repo: every new table gets RLS enabled in the SAME migration.

-- ===========================================================================
-- profiles: one row per signed-in user (mirrors auth.users)
-- ===========================================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can read and update only their own profile.
create policy "profiles: self read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===========================================================================
-- requests: the WORKED EXAMPLE feature (form → table → list).
-- This is the pattern you imitate for your own feature. Copy its shape:
--   a table with a user_id, RLS scoping rows to the owner, and a list view.
-- ===========================================================================
create table if not exists public.requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null,
  message    text not null,
  amount     numeric(10, 2),
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;

-- Owner-only: every operation is scoped to the row's owner.
-- User B literally cannot select, insert-for, update, or delete user A's rows.
create policy "requests: owner select"
  on public.requests for select
  using (auth.uid() = user_id);

create policy "requests: owner insert"
  on public.requests for insert
  with check (auth.uid() = user_id);

create policy "requests: owner update"
  on public.requests for update
  using (auth.uid() = user_id);

create policy "requests: owner delete"
  on public.requests for delete
  using (auth.uid() = user_id);
