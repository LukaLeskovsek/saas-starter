---
name: debug
description: Find and fix the real cause when something breaks — without thrashing. Use when the user says "/debug", "it's broken", "this error", pastes an error, or after a failed /verify. Also in Slovenian: "ne dela", "napaka", "se ne naloži", "je počasno", "vrže error".
---

When invoked, work the problem methodically. The enemy is guessing and changing many things at once.

## Steps
1. **Reproduce** the exact failure — what action, what you expected, what actually happened.
2. **Read the real error** — don't paraphrase from memory. Get the actual text from:
   - the dev server or `npm run build` output, or
   - the **Vercel build log** (for a failed deploy), or
   - **Sentry** (for a live runtime error — it's already captured there), or
   - the browser console.
3. **Isolate** — narrow to the smallest cause. Form one hypothesis; change **one** thing.
4. **Fix** that one thing, then re-run `/verify`.

## Known traps in this repo (check these first)
- **Sign-up bounces back to sign-in, or says "Odpri e-pošto in potrdi naslov":** Supabase "Confirm email" is still ON (Authentication → Sign In / Providers → Email). Turn it off, or confirm via the e-mail.
- **The password-reset link says it is invalid:** it was opened in another browser, an older link was used, or the address is missing from Supabase → URL Configuration → Redirect URLs.
- **Page shows stale or half-built output after `npm run build`:** a build ran while `npm run dev` was running — both write `.next`. Stop dev, `rm -rf .next`, start dev again.
- **AI answers are a "Demo odgovor":** no `OPENROUTER_API_KEY` and `AI_BACKEND` isn't `local-claude` (or `claude` isn't logged in) — the server log says which (`[ai] …`).
- **A table is missing / the feature doesn't save:** its migration wasn't applied — `npm run db:list -- --json` + a probe query shows which.
- **The live site differs from local:** a key missing on Vercel (`npm run vercel:env -- --dry-run`), or you're on the wrong address (Vercel → Settings → Domains).
- **Keys / setup look wrong:** `npm run env:check` (never prints values); `/nastavitev` re-checks every setup step.

## Rules
- One variable at a time. If you change five things and it works, you've learned nothing.
- **Two failed attempts → STOP and reset:** restate the current state, the goal, and the problem; shrink to the smallest next step; try again. Don't spiral.
- Never disable a safety rail (RLS, auth, env-only secrets) just to "make it work."
- Paste the *actual* error to reason from — never debug from a remembered description.
- **If a change made it *worse* than a working state, go back — don't dig forward.**
  `git revert` to the last good commit (it adds a new commit that restores the working
  state; never `git reset --hard` or `git push --force`), then re-verify from there.
