# SaaS Starter

A starter app you make your own: a branded landing page, working sign-in, and one
feature — live on the internet by lunch. Everything security-critical (sign-in,
email, error tracking) is pre-wired to managed services, so you focus on your
product, not the plumbing.

**Stack:** Next.js 15 · Supabase (auth + database) · Resend (email) · Sentry
(errors) · Vercel (hosting). You bring your own free account for each.

---

## 6 steps to a live URL

You can ask Claude Code to do each step with you — that's the point.

### 1. Get the code — your own repo
On GitHub, click **"Use this template" → Create a new repository** and set it
**Private** (so you get your own copy to push to — it holds your app *and its
history*), then:
```bash
git clone https://github.com/<your-username>/saas-starter.git
cd saas-starter
npm install
```
Template source: https://github.com/LukaLeskovsek/saas-starter
New to git? Three safe verbs and one rule: [docs/git-basics.md](docs/git-basics.md).

### 2. Create your Supabase project
- supabase.com → **New project** (pick the EU region; remember the database password).
- **Turn off email confirmation:** Authentication → Sign In / Providers → Email →
  toggle **"Confirm email" OFF**. (Sign-in then works instantly, no email needed.)
- Copy your **Project URL** + **anon key** (Settings → API). Claude sets up the
  database for you in the next step — no SQL pasting.

### 3. Fill in your keys, then let Claude set up the database
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your Supabase URL + anon key, plus a **Supabase
access token** (supabase.com → Account → Access Tokens) so Claude can run your
database setup. Add your Resend key and Sentry DSN when ready — Claude Code can
walk you through it one line at a time.

Then ask Claude: **"run the database migration."** It applies the schema for you:
```bash
npm run db:run -- supabase/migrations/0001_init.sql
npm run db:run -- supabase/migrations/0002_ai.sql
npm run db:run -- supabase/migrations/0003_ai_usage.sql
```
*(No access token? The command tells you to paste the file into Supabase → SQL Editor instead.)*

### 4. Run it locally
```bash
npm run dev
```
Open http://localhost:3000 — the landing page loads. Visit `/login`, create an
account, and you land on your dashboard.

### 5. Make it yours
Ask Claude Code (it reads `PERSON.md` / `COMPANY.md` / `BRAND.md`):
> "Rebrand the landing page in our voice and colours. Don't touch the login flow or `lib/`."

Then replace the worked **requests** feature with your own, keeping its shape
(form → table → list). See `CLAUDE.md` for the rails.

### 6. Put it on the internet
- Push to GitHub.
- vercel.com → **Add New Project** → import your repo.
- Paste the same variables from `.env.local` into Vercel's environment settings.
- Deploy. Your live URL is ready. Every later `git push` redeploys automatically.

More on domains, preview deployments, and staging: see [docs/going-to-production.md](docs/going-to-production.md).

---

## Scripts
- `npm run dev` — local dev server
- `npm run build` — production build (also type-checks)
- `npm run lint` — lint
- `npm start` — run the production build locally
- `npm run audit:security` — fail on high/critical npm advisories

## Notes
- A Supabase "Edge Runtime / `process.version`" warning on build is expected and harmless.
- Secrets live in `.env.local` and in Vercel — never in code, never in chat.
- Security notes: [docs/security.md](docs/security.md).
