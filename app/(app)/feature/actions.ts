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
import { AiDailyLimitError, recordAiUsage } from "@/lib/ai-budget";
import { sl } from "@/lib/i18n/sl";

const t = sl.requests;

const RequestSchema = z.object({
  name: z.string().trim().min(1, t.errName).max(200, t.errName),
  message: z.string().trim().min(1, t.errMessage).max(4000, t.errMessage),
  amount: z.coerce.number(t.errAmount).nonnegative(t.errAmount).optional(),
});

export async function createRequest(formData: FormData) {
  const parsed = RequestSchema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
    amount: formData.get("amount") || undefined,
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? sl.errors.generic;
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
    // The technical reason goes to the server log (and Sentry), not to the person.
    console.error("request insert failed", error);
    redirect(`/feature?error=${encodeURIComponent(t.errSave)}`);
  }

  // The AI step (lib/ai.ts → OpenRouter → Claude), server-side. One call: triage
  // the request and draft a reply. Wrapped so an AI failure never loses the saved
  // row; mock-mode returns canned text when no key is set. THIS is the AI pattern
  // to imitate for your own feature — see /integrate-ai.
  try {
    await recordAiUsage(supabase, "requests");
    const { text } = await generate({
      system:
        "Si jedrnat in prijazen pomočnik za podporo strankam. Odgovarjaj v slovenščini, v 2–3 stavkih.",
      prompt: `Stranka je poslala zahtevek.\nIme: ${parsed.data.name}\nSporočilo: ${parsed.data.message}\n\nOdgovori z:\n1) Razvrstitev v eni vrstici: kategorija in nujnost.\n2) Kratek predlog odgovora.`,
    });
    await supabase.from("requests").update({ ai_draft: text }).eq("id", inserted!.id);
  } catch (e) {
    if (e instanceof AiDailyLimitError) {
      redirect(`/feature?error=${encodeURIComponent(sl.errors.aiLimit)}`);
    }
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
  redirect(`/feature?ok=${encodeURIComponent(t.saved)}`);
}
