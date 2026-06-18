# CLAUDE.md — rules for working in this repo

This is a SaaS starter app for the SPS AI Accelerator. A founder rebrands it,
adds one feature, and ships it. Everything security-critical is already wired to
managed services. Your job is to help with **identity, content, and one feature** —
never plumbing.

## First, read the founder's context

Before any branding or copy work, read these files if they exist in the project:
`PERSON.md`, `COMPANY.md`, `BRAND.md`. Write in that brand voice. If they are
missing, ask for them rather than inventing a voice.

## Where things live

- `app/(marketing)/page.tsx` — the landing page. **This is the main rebrand target.**
- `app/globals.css` — brand colours (CSS variables at the top). Change colour here, not in components.
- `app/(app)/feature/` — the worked example "requests" feature (form → table → list). **Imitate this shape** for the founder's own feature.
- `app/(app)/dashboard/` — the signed-in shell.
- `supabase/migrations/` — database schema + Row Level Security (RLS) policies.
- `lib/`, `app/login/` — auth, Supabase clients, email. Pre-built.

## Never modify

- `app/login/` — the sign-in / sign-up flow. It works; leave it.
- `lib/supabase/` — the Supabase clients and session handling.
- `instrumentation*.ts`, `sentry.*.config.ts`, `next.config.ts` — Sentry wiring.
- Any migration that has already been run on the database.

## Rules

- **Buy, don't build.** Never write a custom auth system, email sender, or error
  tracker. Supabase, Resend, and Sentry are the security strategy.
- **Every new table gets RLS in the same migration.** Never create a table without
  enabling RLS and adding owner-scoped policies. Template:
  ```sql
  alter table public.<name> enable row level security;
  create policy "<name>: owner select" on public.<name>
    for select using (auth.uid() = user_id);
  -- repeat for insert (with check), update, delete
  ```
- **Secrets only via environment variables.** If a key ever appears in code, stop
  and move it to `.env.local`. Never use `NEXT_PUBLIC_` for a server secret.
- **Prefer editing the worked example** over inventing new structure. New feature =
  copy the `requests` shape (a table with `user_id`, RLS, a form, a list).
- **After any change**, run `npm run lint && npm run build` before saying you're done.

## Your build loop (skills in `.claude/skills/`)

Drive the work with these, in order: **`/plan`** (shape the idea, no code) → **`/build`** (one slice, keep it green, commit) → **`/verify`** (run it and prove it works) → **`/debug`** (only if it breaks) → **`/ship`** (go live and confirm the public URL). On Day 3 you'll meet the "pro" version of this loop — Compound Engineering (`/ce-plan` …).

## Build/run

- `npm run dev` — local dev server.
- `npm run lint && npm run build` — the checks that must pass.
- A Supabase Edge Runtime warning on build (`process.version`) is expected and harmless.
