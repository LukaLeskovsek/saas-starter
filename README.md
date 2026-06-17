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

### 1. Get the code
```bash
git clone <your-fork-of-this-repo>
cd saas-starter
npm install
```

### 2. Create your Supabase project
- supabase.com → **New project** (pick the EU region; remember the database password).
- **Turn off email confirmation:** Authentication → Sign In / Providers → Email →
  toggle **"Confirm email" OFF**. (Sign-in then works instantly, no email needed.)
- Run the database setup: SQL Editor → paste the contents of
  `supabase/migrations/0001_init.sql` → **Run**.

### 3. Fill in your keys
```bash
cp .env.example .env.local
```
Then open `.env.local` and fill it in — Claude Code can walk you through it one
line at a time. You need your Supabase URL + anon key (and, when ready, your
Resend key and Sentry DSN).

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

## Notes
- A Supabase "Edge Runtime / `process.version`" warning on build is expected and harmless.
- Secrets live in `.env.local` and in Vercel — never in code, never in chat.
