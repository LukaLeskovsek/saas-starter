"use server";

// The worked example's write path. This is the shape to imitate for your own
// feature: validate input → insert a row (RLS scopes it to the user) → side
// effect (email) → revalidate.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendRequestConfirmation } from "@/lib/email";

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

  const { error } = await supabase.from("requests").insert({
    user_id: user.id, // also defaulted to auth.uid() in the DB
    name: parsed.data.name,
    message: parsed.data.message,
    amount: parsed.data.amount ?? null,
  });
  if (error) {
    redirect(`/feature?error=${encodeURIComponent(error.message)}`);
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
