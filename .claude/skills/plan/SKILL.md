---
name: plan
description: Shape a feature idea into a small, ordered build plan before any code. Use when the user says "/plan", "plan this", "I want to add…", or describes a feature or change. Writes no code.
---

When invoked, turn the user's idea into the smallest sensible plan — then stop. Do not write code; `/build` does that.

## Ideate first (if the idea is fuzzy)
If the user only has a rough direction, spend one quick exchange exploring: offer **2–3 concrete feature options** (one sentence each, smallest-useful framing — and note where an **AI step** would add value, since this is an AI app). Let them pick one, then shape it. Skip this if the idea is already concrete.

## Ask first (don't invent)
If the idea is vague, ask up to **2** short questions (What should it do for the user? What's the one must-have?). If a fact is missing, ask — never guess.

## Read for context
This repo's `CLAUDE.md` (the rails), and `PERSON.md` / `COMPANY.md` / `BRAND.md` if present.

## Output — a short plan, no code
- **Goal:** one sentence, in the user's words.
- **First slice:** the smallest end-to-end piece worth seeing work (aim: done in one sitting).
- **Steps:** 3–6 ordered bullets — what changes and roughly where (which file/area).
- **Imitate:** name the existing pattern to copy — the `requests` feature (`app/(app)/feature/`) is the model for any new feature.
- **Done when:** how you'll know it works (the check `/verify` will run).
- **Out of scope:** what you are explicitly NOT doing now.

## Rules
- Keep it to one screen. If the plan is long, the slice is too big — cut it.
- A plan never touches `app/login/` or `lib/` — those are rails.
- New data = a new table **with RLS in the same migration**; note that in the plan.
- End by offering: *"Ready? `/build` the first slice."*
