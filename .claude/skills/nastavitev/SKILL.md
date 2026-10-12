---
name: nastavitev
description: Set up the SaaS starter from zero for a non-technical founder, step by step — tools on the computer, their own GitHub copy, Supabase (project, Supabase MCP, keys into .env.local, sign-in settings), database migrations, running locally with their first account, optional AI / e-mail / error tracking, publishing on Vercel and the profile pointer. Checks what is already done and continues from the first missing step. Use when the user says "/nastavitev", "nastavi mi aplikacijo", "nastavi saas starter", "namesti", "setup", "nov računalnik", "kam dam ključe", "prijava ne dela po namestitvi", "objavi prvič na Vercel".
---

When invoked, get this person's app running — on their computer and, when they want, live —
**doing every step you safely can yourself** and asking them only for what must be theirs:
creating accounts, accepting terms, payments, passwords, two-factor codes and pasting secret keys.

The person is not technical. Speak Slovenian, one step at a time, short sentences. Before each
step say in one line what it is for ("Supabase je baza in prijava za tvojo aplikacijo."). After
each step check it worked before moving on. `docs/nastavitev.md` is the human-readable version of
this skill — keep them in step.

## Ground rules (non-negotiable)

1. **No secret ever enters the chat.** Secret keys (`OPENROUTER_API_KEY`, `RESEND_API_KEY`,
   `SUPABASE_ACCESS_TOKEN`, the database password) go from the provider's page **straight into
   `.env.local`** (or Vercel) by the person. If they paste one into the chat anyway: don't repeat
   it, tell them to rotate it in the provider's dashboard, and continue.
2. **Never read a secret.** Don't `cat` `.env.local` or print a value. Check keys only with
   `npm run env:check` (prints ✓/✗/⚠, never values).
3. **Public values you write yourself:** Supabase URL, anon/publishable key, `NEXT_PUBLIC_SITE_URL`,
   `AI_BACKEND`, model ids, `EMAIL_FROM`, the Sentry DSN (it is public). Edit the line in place with a
   small Node script; don't echo the result.
4. **Browser:** open the exact page the person needs:
   - With **Claude in Chrome** connected, you may navigate and read *non-secret* pages (project
     list, URL, settings) and click through navigation.
   - Without it, run `open "<url>"` (macOS), `start "" "<url>"` (Windows) or `xdg-open "<url>"`.
   - **Never read, screenshot or record a page while a key is shown on it.** Hand over and wait.
5. **The person does:** sign-ups, logins (`! gh auth login --web`, `! npx vercel login` — tell them
   to type the `!` line), organisation and region choices, payment and spending limits, the database
   password (into their password manager, not to you), OAuth consent screens, "Redeploy" and
   on/off switches that are account settings.
6. **Ask before anything that leaves the machine:** creating the GitHub repo, `git push`,
   `vercel:env` (sends keys to Vercel), migrations on a database that already has data.
7. One step at a time. If a step fails twice, stop and say plainly what you saw. `/debug` lists this
   repo's known traps.

## Step 0 — Where are we? (always first)

Run these quietly and show a short ✓/✗ list in Slovenian; then start at the first ✗. Re-run the
list whenever the person comes back ("nadaljuj nastavitev").

| # | Check | How |
|---|---|---|
| 1 | Tools | `node -v` (≥ 22), `git --version`, `gh --version`, `gh auth status` |
| 2 | Own copy | `gh repo view --json nameWithOwner,visibility` — their account, `PRIVATE`; not `LukaLeskovsek/saas-starter` |
| 3 | Supabase project + MCP | Supabase MCP tools available (e.g. `get_project_url`) and answering for one project |
| 4 | Keys | `npm run env:check` — Supabase lines ✓ |
| 5 | Sign-in settings | ask, or check in Chrome: "Confirm email" off; Site URL + Redirect URLs set (Step 5) |
| 6 | Database | probe query from Step 6 → all `true` |
| 7 | Runs locally | `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/login` → 200 |
| 8 | First account | MCP `execute_sql`: `select count(*) from public.profiles` → ≥ 1 |
| 9 | Optional services | `env:check`: `OPENROUTER_API_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_SENTRY_DSN` — or the person chose to skip |
| 10 | Live (optional) | `.vercel/project.json` exists and the live `/login` returns 200 |
| 11 | Profile (optional) | `.claude/profile-location.local.md` exists |

## Step 1 — Tools on the computer

- **Node 22+:** missing or older → open `https://nodejs.org/en/download` (LTS installer); they run it,
  then restart the terminal and Claude Code.
- **git:** macOS without git → `xcode-select --install` (they confirm the dialog). Windows →
  `https://git-scm.com/download/win`.
- **GitHub CLI (`gh`):** `brew install gh` if Homebrew exists, else open `https://cli.github.com`.
- **GitHub login:** no account → open `https://github.com/signup`. Then they type
  `! gh auth login --web` and finish in the browser.
- **Packages:** `npm ci`.

## Step 2 — Their own private copy on GitHub

- Starting from nothing (not inside the repo yet): `gh repo create <ime> --template
  LukaLeskovsek/saas-starter --private --clone`, then continue inside that folder.
- Inside a clone of the template (origin is `LukaLeskovsek/saas-starter`): ask for a name, then
  `git remote rename origin template` and `gh repo create <ime> --private --source=. --remote=origin --push`.
- Check: `gh repo view --json visibility` → `PRIVATE`.

## Step 3 — Supabase project (they create it), then Supabase MCP (you connect it)

1. Open `https://supabase.com/dashboard/new` (sign-up first if needed: `https://supabase.com/dashboard/sign-up`,
   GitHub login is fine). They choose: organisation, project name, **Region: Central EU (Frankfurt)**,
   and a **database password** → into their password manager. Free plan is enough.
   **One project per app:** never point this app at a Supabase project another app already uses
   (e.g. internal-os) — both create `public.handle_new_user()` and would overwrite each other.
2. Get the **project ref** (20 lowercase letters/digits): from the address bar
   (`supabase.com/dashboard/project/<ref>`) — read it in Chrome or ask them to paste the address; it is
   not a secret.
3. Connect the MCP **scoped to this one project**:
   ```
   claude mcp add --transport http --scope local supabase "https://mcp.supabase.com/mcp?project_ref=<ref>&features=database,development,docs,debugging"
   ```
   Then tell them: "Zapri Claude Code (`/exit`), ga znova odpri v tej mapi, napiši `/mcp`, izberi
   **supabase → Authenticate**, v brskalniku potrdi in izberi organizacijo. Potem napiši: nadaljuj
   nastavitev." (OAuth replaces the account-wide `SUPABASE_ACCESS_TOKEN`; it is no longer needed.)
4. Check: MCP `get_project_url` returns `https://<ref>.supabase.co`.

## Step 4 — Keys into `.env.local`

1. `.env.local` missing → `cp .env.example .env.local`.
2. You write the public values: `NEXT_PUBLIC_SUPABASE_URL` (from `get_project_url`),
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from `get_publishable_keys`: the legacy `anon` key if listed,
   else the `sb_publishable_…` key) and `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
   This app needs no secret Supabase key.
3. Check: `npm run env:check`. Fix any ⚠ (a key in the wrong line, a secret pasted into a `#` comment).

## Step 5 — Sign-in settings in Supabase

1. Open `https://supabase.com/dashboard/project/<ref>/auth/providers` → **Email**. They turn
   **Confirm email OFF** and save. (Sign-up then signs people in at once. If it stays on, sign-up
   still works but asks the person to confirm by e-mail first.)
2. Open `https://supabase.com/dashboard/project/<ref>/auth/url-configuration`. They set:
   - **Site URL:** `http://localhost:3000` (changes to the live address in Step 9).
   - **Redirect URLs → Add URL:** `http://localhost:3000/**` (the password-reset link needs it).

## Step 6 — Database (migrations through Supabase MCP)

1. `npm run db:list -- --json` → every file in order, with `probe` (a table that exists once the file
   ran) and `rerunSafe`.
2. One MCP `execute_sql`: `select to_regclass('<probe>') is not null as "<file>", …` for every file
   with a probe.
3. Apply, in list order, every file whose probe is `false`, plus every probe-less file (they are all
   `rerunSafe`): MCP `apply_migration` with `name` = the file name without `.sql`
   (e.g. `0001_init`) and `query` = the file's content.
4. Check: the probe query again → all `true`.
5. No MCP (the person declined it): `npm run db:run -- <file>` per file needs `SUPABASE_ACCESS_TOKEN`
   (supabase.com → Account → Access Tokens, pasted by them into `.env.local`) — same order, same probes.

## Step 7 — Start the app and make the first account

Start `npm run dev` in the background (never `npm run build` while it runs). Wait until
`http://localhost:3000/login` answers 200, then open `http://localhost:3000`. They click **Začni**,
create an account (e-mail and password, into their password manager) and land on **Nadzorna plošča**.
Check: the account query from Step 0 → ≥ 1.

## Step 8 — Optional services

Ask which they want now; each can wait.
- **AI** — demo answers (no key, no cost); real AI → open `https://openrouter.ai/settings/keys`,
  they add a small credit, create a key **with a credit limit** (e.g. 5 USD) and paste it after
  `OPENROUTER_API_KEY=` (same hand-off as secrets elsewhere: `open -e .env.local` / `notepad .env.local`);
  you set `AI_BACKEND=openrouter`. Their Claude subscription on this computer only →
  `AI_BACKEND=local-claude` (make sure `ANTHROPIC_API_KEY` is not set). Not for the live app.
- **E-mail (Resend)** → open `https://resend.com/api-keys`; they create a key and paste it after
  `RESEND_API_KEY=`. `EMAIL_FROM=onboarding@resend.dev` only delivers to their own account e-mail
  until they verify a domain.
- **Error tracking (Sentry)** → open `https://sentry.io/signup/`; they create a Next.js project; the
  DSN is public, so you may write `NEXT_PUBLIC_SENTRY_DSN` once they show it to you.
Check: `env:check`. Restart `npm run dev` after changing `.env.local`.

## Step 9 — Live on the internet (optional, when they want to share it)

1. Open `https://vercel.com/new`; they sign up with GitHub and **Import** their repo (defaults are
   right). A first build may fail without keys — fine.
2. They type `! npx vercel login`; you run `npx vercel link --yes --project <name>`.
   `vercel link` appends `.env*` to `.gitignore` (that hides `.env.example`) and a
   `VERCEL_OIDC_TOKEN` to `.env.local`: `git checkout -- .gitignore`; the token line may stay.
   Existing Vercel variables marked Sensitive can't be read back (`env pull` shows
   `[SENSITIVE]`); when in doubt, overwrite them with step 4.
3. Find the real production address in Vercel → the project → **Settings → Domains** (Vercel adds a
   suffix like `-abc1` when the plain name is taken by someone else — don't guess it).
4. Ask, then run `npm run vercel:env -- --site-url https://<that address>` (sends the keys without
   printing them; `--dry-run` first shows the list).
5. Redeploy: open the project's **Deployments** page; they click **Redeploy** on the latest one.
6. Supabase sign-in settings (Step 5 page): **Site URL** → the live address; **Redirect URLs** → add
   `https://<live address>/**` (keep the localhost one).
7. If the live address shows a Vercel login: open the project's **Settings → Deployment Protection**;
   they turn off **Vercel Authentication**.
8. Check: open the live `/login`; they sign in with the same account; the dashboard loads.

## Step 10 — Profile pointer (optional)

If they have a profile folder (PERSON.md, INDEX.md, a company folder with COMPANY.md, BRAND.md,
PRIMERI.md), ask for its path and the company, then write `.claude/profile-location.local.md`
(gitignored):
```
# Profil za to aplikacijo
pot: /pot/do/profila
podjetje: <ime mape podjetja>
potrjeno: <YYYY-MM-DD>
```
Don't copy profile content into the repo.

## Finish

Show the Step 0 list again, all ✓ (optional ones marked "preskočeno"), the local and live
addresses, and one next step: "Povej, kakšna naj bo tvoja stran — npr. »prilagodi domačo stran
mojemu podjetju«."
