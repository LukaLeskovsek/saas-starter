---
name: verify
description: Prove the change actually works — run it and exercise the feature. Use when the user says "/verify", "does it work", "test it", or after /build. Reports concrete pass/fail.
---

When invoked, don't *say* it works — *show* it. Run the app, walk the real flow, and report what you actually observed.

## Steps
1. `npm run lint && npm run build` — must be green.
2. Run the app (`npm run dev`, or use the deployed URL) and walk the flow:
   - Sign in works (create account → land on the dashboard).
   - The feature does its job: submit → it saves → it shows in the list.
3. **Stack safety checks (don't skip):**
   - **RLS isolation:** with a *second* account, confirm you **cannot** see the first account's rows.
   - **No secret leaks:** after `npm run build`, grep `.next/` — `SUPABASE_SERVICE_ROLE_KEY` (and any server secret) must be **absent** from the client bundle.
4. Report a checklist of ✓ / ✗ with what you actually saw — not "should work."

## Rules
- "Works" means you ran it and watched it happen. No assumptions.
- Any ✗ → hand to `/debug`. Do not ship a failing build.
- All ✓ → suggest *"`/ship` it."*
