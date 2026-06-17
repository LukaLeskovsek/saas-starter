# Architecture (one page)

## The pipeline

```
your browser  →  Next.js (React)  →  Node  →  GitHub  →  Vercel  →  live URL
                      │
                      ├── Supabase   (sign-in + database)
                      ├── Resend     (sends email)
                      └── Sentry     (catches errors)
```

You write/describe changes → Claude Code edits code → you review locally
(`npm run dev`) → push to GitHub → Vercel builds and deploys in about a minute.

## Buy, don't build — what each service protects

| Concern | Service | Why you don't build it yourself |
|---|---|---|
| Sign-in + database | **Supabase** | Auth and data security are too important to hand-roll. Paying for it *is* the security strategy. |
| Sending email | **Resend** | Deliverability is a specialist problem; a managed sender just works. |
| Knowing when you break | **Sentry** | You find out before your customer does. |
| Hosting + delivery | **Vercel** | Push to deploy; preview URLs per branch; no servers to manage. |

The rule: for anything security-critical, paying for a managed service is the safe
choice. Building your own login or email sending is the big no-no.

## Where things live

- `app/(marketing)/page.tsx` — the landing page (your main rebrand target).
- `app/login/` — sign-in / sign-up (password). Pre-built; don't touch.
- `app/(app)/` — everything behind sign-in: `dashboard/` and the `feature/` example.
- `app/globals.css` — brand colours as CSS variables.
- `lib/supabase/` — Supabase clients + session handling. Pre-built.
- `lib/email.ts` — the Resend wrapper.
- `supabase/migrations/` — database tables + Row Level Security.
- `instrumentation*.ts`, `sentry.*.config.ts` — Sentry wiring.

## Row Level Security (RLS) — the safety net

RLS makes the **database itself** refuse to return another user's rows, even if
the app code has a bug. Every table in this app turns RLS on and adds owner-scoped
policies (`auth.uid() = user_id`) in the same migration. See
`supabase/migrations/0001_init.sql` for the worked example — copy that shape for
every new table.
