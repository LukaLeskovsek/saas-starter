---
name: plan
description: Shape a feature idea into a small, ordered build plan before any code. Use when the user says "/plan", "plan this", "I want to add…", or describes a feature or change. Writes no code.
---

When invoked, turn the user's idea into the smallest sensible plan — then stop. Do not write code; `/build` does that.

## Ideate first (if the idea is fuzzy)
If the user only has a rough direction, spend one quick exchange exploring: offer **2–3 concrete feature options** (one sentence each, smallest-useful framing — and note where an **AI step** would add value, since this is an AI app). Let them pick one, then shape it. Skip this if the idea is already concrete.

## Grill first (extract, don't assume)
Once a direction is picked, run **2–3 rounds of "grill me"** — **one sharp question at a
time**, each building on the last answer (never a wall of questions). Founders
under-specify; your job is to pull what's in their head onto the table. Keep going until
you can state the **input → process → output** concretely. Pick the angles still fuzzy:
- **Job:** what does this do for the user, in one sentence? What triggers it?
- **Input:** what goes in, and where from — a form field, a paste, a saved row, an external system?
- **Process:** what happens to it — match, draft, classify, summarise? Is there a human approval step?
- **Output:** what comes out — a saved row, a draft, a table, a decision — and where does it show?
- **Done:** what would make you say "yes, that works"? Which edge cases actually matter?
- **Not now:** what's explicitly out of scope for the first version?

Stop when you have enough for a real first slice. Then **reflect the input → process →
output back in one line and get a "yes"** before writing the plan. Never guess a missing
fact — ask.

## Read for context
This repo's `CLAUDE.md` (the rails), and `PERSON.md` / `COMPANY.md` / `BRAND.md` if present.

## Output — a short plan, no code
- **Goal:** one sentence, in the user's words.
- **First slice:** the smallest end-to-end piece worth seeing work (aim: done in one sitting).
- **Steps:** 3–6 ordered bullets — what changes and roughly where (which file/area).
- **Imitate:** name the existing pattern to copy — the `requests` feature (`app/(app)/feature/`) is the model for any new feature.
- **Done when:** how you'll know it works (the check `/verify` will run).
- **Out of scope:** what you are explicitly NOT doing now.

## Artifact (write the plan down)
After showing the plan, **write it to `docs/features/<slug>/feature.md`** — the Feature
Card (format in `docs/features/README.md`), where `<slug>` is a short kebab name for the
feature. This is the source of truth `/build` reads and the doc the founder edits to steer
the work: fill Goal / What-it-does (I/O) / Done-when / Out-of-scope; set `status: planned`.

## Rules
- Keep it to one screen. If the plan is long, the slice is too big — cut it.
- A plan never touches `app/login/` or `lib/` — those are rails.
- New data = a new table **with RLS in the same migration**; note that in the plan.
- End by offering: *"Ready? `/build` the first slice."*
