"use server";

// The worked example's write path — an AI feature. This is the shape to imitate:
// validate input → insert a row (RLS scopes it to the user) → call an LLM
// (server-side, via lib/ai.ts) → store the result → side effect (email) → revalidate.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendRequestConfirmation } from "@/lib/email";
import { generate } from "@/lib/ai";

const RequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
  amount: z.coerce.number().nonnegative().optional(),
});

export async function createRequest(formData: FormData) {
  const parsed = RequestSchema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
    amount: formData.get("amount") || undefined,
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    redirect(`/feature?error=${encodeURIComponent(msg)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: inserted, error } = await supabase
    .from("requests")
    .insert({
      user_id: user.id, // also defaulted to auth.uid() in the DB
      name: parsed.data.name,
      message: parsed.data.message,
      amount: parsed.data.amount ?? null,
    })
    .select("id")
    .single();
  if (error) {
    redirect(`/feature?error=${encodeURIComponent(error.message)}`);
  }

  // The AI step (lib/ai.ts → OpenRouter → Claude), server-side. One call: triage
  // the request and draft a reply. Wrapped so an AI failure never loses the saved
  // row; mock-mode returns canned text when no key is set. THIS is the AI pattern
  // to imitate for your own feature — see /integrate-ai.
  try {
    const { text } = await generate({
      system:
        "You are a concise, friendly support assistant. Keep replies to 2–3 sentences.",
      prompt: `A user submitted a request.\nName: ${parsed.data.name}\nMessage: ${parsed.data.message}\n\nRespond with:\n1) One-line triage: category + urgency.\n2) A short suggested reply.`,
    });
    await supabase.from("requests").update({ ai_draft: text }).eq("id", inserted!.id);
  } catch (e) {
    console.error("AI draft failed", e);
  }

  // Where Resend visibly works. Wrapped so an email failure never loses the
  // saved row — and any error surfaces in Sentry on the server.
  try {
    await sendRequestConfirmation({ to: user.email!, name: parsed.data.name });
  } catch (e) {
    console.error("request confirmation email failed", e);
  }

  revalidatePath("/feature");
  redirect("/feature?ok=1");
}
