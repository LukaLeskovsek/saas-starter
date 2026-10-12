# Going to production

The first publish is a step in `/nastavitev` (human version: [nastavitev.md](nastavitev.md),
step 9). This page adds what comes after.

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
Vercel comments the preview URL on the push. When you're happy, ask Claude to merge it
into `main` (a local merge — no pull request while you're solo; see `workflow-mode.md`).

**Undo safely.** Broke something? `git revert` to the last good commit — never
`git reset --hard` or `git push --force`. The three safe verbs are in
[git-basics.md](git-basics.md).

## Environment variables

The variables in `.env.local` must also be set in **Vercel → Project → Settings →
Environment Variables**. `npm run vercel:env -- --site-url https://<live address>` copies
them without printing a value (`--dry-run` lists the names first). If the live site
behaves differently from local, a missing or different env var is the first thing to
check. The list is in `.env.example`.

## Your live address

Vercel → Project → Settings → **Domains** shows it. When the plain
`<project>.vercel.app` name is taken by someone else, Vercel adds a suffix
(`<project>-abc1.vercel.app`); the address without the suffix is then someone else's
site. Add the live address to Supabase → Authentication → **URL Configuration** (Site URL
and Redirect URLs), or password reset links won't work there.

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
