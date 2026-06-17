# Going to production

The full pipeline walkthrough is the workshop guide **`nextjs-vercel-github-pipeline.md`**
(in your install package). This page only adds the repo-specific notes.

## Production = your `main` branch

Your live URL always shows whatever is on `main`. Push to `main` → Vercel
redeploys in ~1 minute.

## Preview deployments = free staging

Every branch other than `main` gets its **own preview URL** automatically. Use it
to try something risky without touching your live site:
```bash
git checkout -b try-new-headline
# ...changes, commit, push...
```
Vercel comments the preview URL on the push. When you're happy, merge to `main`.

## Environment variables

The variables in `.env.local` must also be set in **Vercel → Project → Settings →
Environment Variables**. If the live site behaves differently from local, a missing
or different env var is the first thing to check. The list is in `.env.example`.

## Custom domain

Vercel → Project → Settings → Domains → add your domain → follow the DNS
instructions at your registrar. DNS can take a while to propagate — do this when
you're not in a hurry (not live in the room).

## Email on your own domain (after the program)

During the workshop, `EMAIL_FROM=onboarding@resend.dev` (Resend's test sender) only
delivers to your own account email — which is fine, because the app emails the
signed-in user. To email anyone, verify your own domain in Resend
(Resend → Domains → add domain → DNS records) and set `EMAIL_FROM` to an address
on it.

## Before real customers

- Delete the "Trigger a test error" button (`components/test-error-button.tsx` and
  its card on the dashboard).
- Verify your Resend domain (above).
- Review your Supabase RLS policies for every table you added.
