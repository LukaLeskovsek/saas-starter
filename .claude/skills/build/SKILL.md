---
name: build
description: Execute one slice of the plan — make the change, keep it green, commit. Use when the user says "/build", "build it", "do the next slice", or after /plan. One slice at a time.
---

When invoked, implement **one** slice (the next one from `/plan`) inside the repo's rails — not the whole plan.

## Read for context
`CLAUDE.md` (rails), the plan from `/plan`, and the worked example in `app/(app)/feature/` (the pattern to imitate).

## Grill first (nail the slice)
Before touching code, run **1–2 rounds of "grill me"** — one question at a time — to pin
down *this* slice: the exact behaviour, the precise input and output, where the data comes
from, and what "done" looks like (the check `/verify` will run). If `/plan` left anything
fuzzy, resolve it here — don't build on a guess. Reflect the slice back in one sentence,
get a "yes", then build.

## Steps
1. State the one slice you're doing (one sentence).
2. Make the change. Imitate the `requests` feature for anything new (form → RLS table → list).
3. New table? Add it with **RLS policies in the same migration** (owner-scoped). Never an unprotected table. **Then run that migration** — `npm run db:run -- supabase/migrations/<file>.sql` — and confirm the table exists. The feature silently fails until it's applied. *(No token set? The command falls back to telling the user to paste it in Supabase.)*
4. Run `npm run lint && npm run build`. If it's red, fix it before going further.
5. Show the user the diff in plain language — what changed, and why.
6. Commit with a clear message.
7. **Record it.** Append `docs/features/<slug>/runs/<YYYY-MM-DD-HHMM>-build.md` (the slice, files changed, commit ref — format in `docs/features/README.md`) and set the Card's `status: built`. **Stop** — don't start the next slice.

## Rules
- Never modify `app/login/`, `lib/supabase/`, `lib/email.ts`, the Sentry config, or a migration that already ran.
- Secrets only via env — if a key appears in code, stop and move it to `.env.local`.
- Keep the tree green: lint + build must pass before you commit.
- **Commit only — never push or open a pull request.** Going live is `/ship`'s job; pull requests stay OFF unless `CLAUDE.md` Workflow mode says ON.
- After building, suggest: *"`/verify` to prove it works."*
