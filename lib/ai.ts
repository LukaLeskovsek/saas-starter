// The app's AI calls go through here. SERVER-ONLY.
//
// Uses OpenRouter via the OpenAI-compatible SDK — the SAME capped key your Hermes
// agent uses, so no new account. Default model is Claude; set OPENROUTER_MODEL to
// switch (e.g. an OpenAI model) — the call shape never changes.
//
// SECURITY: OPENROUTER_API_KEY is server-only — never NEXT_PUBLIC, never in the
// browser. Only call generate() from Server Actions / route handlers.
//
// This is the shape to imitate for any AI feature: build a prompt, call generate(),
// store the result (in an RLS-scoped table), render it. Use /integrate-ai.
import "server-only";
import OpenAI from "openai";

// Cheap + fast default for a workshop (the key is capped). Verify the current slug
// at openrouter.ai/models; bump to a stronger Claude model if you want.
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-haiku";

/** True when a real key is set. When false, generate() returns mock output. */
export function aiConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

/**
 * One LLM call: text in, text out. No key set (first local run, CI, or a founder
 * who hasn't added one yet) → mock mode, so the feature still works end-to-end
 * with zero spend. Same idea as the Resend / Intrix fallbacks.
 */
export async function generate(params: {
  prompt: string;
  system?: string;
  model?: string;
}): Promise<{ text: string; mock: boolean }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { text: mockOutput(), mock: true };
  }

  const client = new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });

  const res = await client.chat.completions.create({
    model: params.model ?? DEFAULT_MODEL,
    max_tokens: 400,
    messages: [
      ...(params.system
        ? [{ role: "system" as const, content: params.system }]
        : []),
      { role: "user" as const, content: params.prompt },
    ],
  });

  return { text: res.choices[0]?.message?.content?.trim() ?? "", mock: false };
}

function mockOutput(): string {
  return [
    "[mock AI — set OPENROUTER_API_KEY in .env.local for real output]",
    "Triage: general · normal priority.",
    "Suggested reply: Thanks for reaching out — we've received your message and will follow up shortly.",
  ].join("\n");
}
