---
name: build
description: Execute one slice of the plan — make the change, keep it green, commit. Use when the user says "/build", "build it", "do the next slice", or after /plan. One slice at a time.
---

When invoked, implement **one** slice (the next one from `/plan`) inside the repo's rails — not the whole plan.

## Read for context
`CLAUDE.md` (rails), the plan from `/plan`, and the worked example in `app/(app)/feature/` (the pattern to imitate).

## Steps
1. State the one slice you're doing (one sentence).
2. Make the change. Imitate the `requests` feature for anything new (form → RLS table → list).
3. New table? Add it with **RLS policies in the same migration** (owner-scoped). Never an unprotected table.
4. Run `npm run lint && npm run build`. If it's red, fix it before going further.
5. Show the user the diff in plain language — what changed, and why.
6. Commit with a clear message. **Stop** — don't start the next slice.

## Rules
- Never modify `app/login/`, `lib/supabase/`, `lib/email.ts`, the Sentry config, or a migration that already ran.
- Secrets only via env — if a key appears in code, stop and move it to `.env.local`.
- Keep the tree green: lint + build must pass before you commit.
- After building, suggest: *"`/verify` to prove it works."*
