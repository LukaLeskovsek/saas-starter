-- 0002_ai.sql — make the worked example an AI feature.
-- Apply with:  npm run db:run -- supabase/migrations/0002_ai.sql
--
-- Adds one column to `requests`: the AI's triage + suggested reply, generated
-- server-side (lib/ai.ts → OpenRouter → Claude) right after the row is saved.
-- RLS already scopes `requests` to the owner, so the new column inherits it —
-- no new policy needed (a column is covered by the table's row policies).

alter table public.requests add column if not exists ai_draft text;
