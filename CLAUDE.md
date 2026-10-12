# CLAUDE.md — rules for working in this repo

This is the SaaS starter for Day 2 of the Tovarna podjemov workshop. A founder rebrands it,
adds one feature, and ships it. Everything security-critical is already wired to
managed services. Your job is to help with **identity, content, and one feature** —
never plumbing. The founder is not a programmer and speaks Slovenian: answer in Slovenian,
and keep everything they see in the app in Slovenian.

## First, read the founder's context

Before any branding or copy work, read the profile at the confirmed location in
`.claude/profile-location.local.md` (gitignored; `/nastavitev` writes it): PERSON.md and
INDEX.md, then the selected company's COMPANY.md, BRAND.md and PRIMERI.md. If the pointer is
missing, use root-level `PERSON.md` / `COMPANY.md` / `BRAND.md` if they exist; otherwise ask
rather than inventing a voice. Never copy the whole profile into the repo.

## You pick the skill — the founder never has to remember one

The founder talks normally ("nastavi mi aplikacijo", "prilagodi stran", "to ne dela", "daj v živo").
**You** choose the skill from `.claude/skills/`, say in one line which one and why, and run it.
Slash commands still work, but never ask the founder to type one.

| When the founder… | Run |
|---|---|
| is setting up the app, a new computer, keys or the first publish ("nastavi mi aplikacijo") | `/nastavitev` |
| describes an idea, a feature or a change in behaviour (also a rebrand of the landing page) | `/plan` (always first — no code before the plan exists) |
| agrees to the plan ("ja", "naredi", "gremo") or asks for the next step | `/build` |
| wants AI to read, draft, sort, summarise or answer | `/integrate-ai` |
| asks "ali dela?", "preveri", or a slice was just built | `/verify` |
| reports an error, pastes one, or says something is broken / slow | `/debug` |
| wants it live, deployed, shared | `/ship` (only after a passing `/verify`) |

Ask before anything that leaves the machine (push, deploy, a write to an external system).

## Where things live

- `app/(marketing)/page.tsx` — the landing page. **This is the main rebrand target.**
- `config/brand.ts` — the product name, tagline and footer line.
- `app/globals.css` — brand colours (`--brand`, `--neutral-hue`, `--radius` at the top). Change colour here, not in components.
- `app/layout.tsx` — the font (`next/font`, keep the `latin-ext` subset for č, š, ž).
- `app/(app)/feature/` — the worked example "requests" feature, an **AI feature**: form → table → **LLM call** (triage + draft reply) → list. **Imitate this shape** for the founder's own AI feature.
- `lib/ai.ts` — the **server-only** LLM helper (OpenRouter via the OpenAI SDK, default Claude, mock-mode when no key). All AI calls go through `generate()`. Never call it from a client component.
- `app/(app)/dashboard/` — the signed-in shell.
- `supabase/migrations/` — database schema + Row Level Security (RLS) policies.
- `lib/`, `app/login/`, `app/auth/`, `app/forgot-password/`, `app/(app)/setup-password/` — auth (incl. forgotten password), Supabase clients, email. Pre-built.
- `components/ui/` (shadcn on Base UI) and `components/app/` (PageHeader, EmptyState, AuthShell, UserMenu, ActionForm, Field …) — shared building blocks; reuse them.
- `lib/i18n/sl.ts` — shared Slovenian copy; `lib/format.ts` — dates, money and plurals in Slovenian (never show a raw ISO date or `toFixed()` number).

## Never modify

- `app/login/`, `app/auth/`, `app/forgot-password/`, `app/(app)/setup-password/` — the sign-in,
  sign-up and password-reset flow. It works; leave it.
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
- **Slovenian copy.** Shared words come from `lib/i18n/sl.ts`, a page's own words can live next
  to it; dates and money go through `lib/format.ts`. No developer words in the UI (no env-var
  names, table names, "RLS", "mock"): say "Demo podatki" instead.
- **After any change**, run `npx tsc --noEmit && npm run lint` (and `npm run build` only when
  `npm run dev` is not running — both write `.next`) before saying you're done.
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

The UI is shadcn/ui (Base UI + Tailwind v4) in a warm, friendly style shared with internal-os.
Rebrand via the tokens at the top of `app/globals.css` (`--brand`, `--neutral-hue`, `--radius`),
the font in `app/layout.tsx` and the words in `config/brand.ts` — not component files. Use
tokens only (`bg-primary`, `text-muted-foreground`, `bg-accent`, `bg-success/12` …), never hex
values or Tailwind palette colours. Compose links with `render={<Link href="…" />}`, never
`asChild`. Light and dark mode both work; check both.
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
