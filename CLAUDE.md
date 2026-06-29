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
- `app/(app)/feature/` — the worked example "requests" feature, an **AI feature**: form → table → **LLM call** (triage + draft reply) → list. **Imitate this shape** for the founder's own AI feature.
- `lib/ai.ts` — the **server-only** LLM helper (OpenRouter via the OpenAI SDK, default Claude, mock-mode when no key). All AI calls go through `generate()`. Never call it from a client component.
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
- **AI calls are server-side, through `lib/ai.ts`.** Never call an LLM from a client
  component or expose `OPENROUTER_API_KEY` to the browser. Store AI output in an
  RLS-scoped table, the same as any other data. Use `/integrate-ai` to add one.
- **Prefer editing the worked example** over inventing new structure. New feature =
  copy the `requests` shape (a table with `user_id`, RLS, a form, a list).
- **After any change**, run `npm run lint && npm run build` before saying you're done.
- **Undo via `git revert`, never `git reset --hard` or `git push --force`.** If a change
  broke a working state, revert to the last good commit (a new commit that restores it)
  and re-verify from there. The commit history is the founder's safety net — keep it intact.

## Your build loop (skills in `.claude/skills/`)

Drive the work with these, in order: **`/plan`** (ideate + shape the idea, no code) → **`/build`** (one slice, keep it green, commit) → **`/verify`** (run it and prove it works) → **`/debug`** (only if it breaks) → **`/ship`** (go live and confirm the public URL). To add an AI feature, **`/integrate-ai`** (server-side LLM via `lib/ai.ts`). On Day 3 you'll meet the "pro" version of this loop — Compound Engineering (`/ce-plan` …).

## Workflow mode — pull requests OFF

**Pull requests: OFF** — solo founder, trunk-based.

While OFF:
- `/build` commits; `/ship` pushes straight to `main` (push = deploy).
- A risky change may use a short-lived branch for a preview URL, then **merge into `main` locally** (`git checkout main && git merge <branch> && git push`). **Never open a pull request while this is OFF.**
- Undo with `git revert`; never `git reset --hard` or `git push --force`.

To turn pull requests ON (a teammate joins, or you want review before deploy), change the line above to `Pull requests: ON` and see `docs/workflow-mode.md`. When ON, `/ship` opens a PR (`gh pr create`) and merges when checks pass.

## Design system (shadcn/ui)

The UI is shadcn/ui (Base UI + Tailwind v4) in a premium-neutral style. Rebrand via the
tokens at the top of `app/globals.css` (`--primary`, `--radius`) — not component files.
**Every Server Action form submits with `<SubmitButton>`** (`components/ui/submit-button.tsx`),
which shows a spinner and disables while pending (no double-submit). Action results surface
as toasts via `?ok=` / `?error=`. Signed-in pages live under `app/(app)/` so they inherit
the padded shell + header. Match these patterns for new UI.

## Design rules — make it beautiful, not generic

When building or restyling any UI (especially the landing page), design with
intent and avoid the generic "AI slop" look:

- **Plan before code.** For any new page, first propose a compact design plan —
  a 4–6 colour palette, 2 distinctive typefaces (display + body), a layout
  concept, and ONE signature element the page is remembered by. Confirm it isn't
  a generic default, then write code to that plan.
- **Fonts:** never use Inter, Roboto, Open Sans, Lato, Arial, or system fonts;
  avoid Space Grotesk too. Pick distinctive typefaces that fit the brand (set
  them in `app/layout.tsx` via `next/font`).
- **Colour:** no clichéd schemes — especially no purple gradients on white.
  Drive everything from the brand tokens in `app/globals.css`; *extend* them
  (e.g. an accent, or a dark hero surface token) rather than hardcoding hex in
  components.
- **Contrast & rhythm:** use extremes, not safe middles — weights 100/200 vs
  800/900 (not 400 vs 600), size jumps of 3x+ (not 1.5x), generous whitespace,
  atmosphere over flat colour.
- **Verify visually:** after a UI change, view the rendered page (screenshot it),
  compare to the intended design, list what's off, and fix it before saying
  you're done.

## Build/run

- `npm run dev` — local dev server.
- `npm run lint && npm run build` — the checks that must pass.
- A Supabase Edge Runtime warning on build (`process.version`) is expected and harmless.
