---
name: integrate-ai
description: Add an AI feature — a server-side LLM call via lib/ai.ts. Use when the user says "/integrate-ai", "add AI", "make it summarize/draft/classify/answer", or wants an LLM in their app. Models on the requests feature.
---

When invoked, add one AI capability the smallest useful way, server-side, and store the result like any other data. The worked example (`app/(app)/feature/`) already does this — imitate it.

## Ask first (don't invent)
1. **What should the AI do?** (classify, summarize, draft a reply, answer a question…)
2. **What's the input** (a form field, a saved row, a module's data) and **where does the output show**?

## The pattern (imitate the requests feature)
1. **Build the prompt** from the input. A clear `system` line (role + length limit) + a `prompt` with the data.
2. **Call `generate({ system, prompt })`** from `lib/ai.ts` — inside a Server Action or route handler, **never** a client component.
3. **Store the result** in an RLS-scoped column/table (new table → RLS in the same migration; `npm run db:run`).
4. **Render it.** Wrap the call in try/catch so a failure never loses the row.

## Rules
- **Server-only.** `OPENROUTER_API_KEY` never reaches the browser, never `NEXT_PUBLIC_`, never in code.
- **Mock-mode is fine.** No key → `lib/ai.ts` returns canned output; the feature still works (zero spend). Don't add a second AI path.
- **Cost + safety.** The key is capped. Keep `max_tokens` small; one call per action. Don't loop LLM calls.
- **Model.** Default is Claude via OpenRouter (`OPENROUTER_MODEL`); switch the slug to use another provider — the code doesn't change.
- Keep it one slice. End by offering: *"Ready? `/verify` it."*
