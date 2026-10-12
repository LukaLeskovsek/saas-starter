"use server";

// Password auth (sign up / sign in / sign out) as Server Actions.
// DONE — do not modify. There is no magic link: sign-in has no email
// dependency, which is what makes it reliable. The setup turns Supabase's
// "Confirm email" OFF (Authentication → Sign In / Providers → Email), so sign-up
// signs the person in at once. If it is left ON, sign-up still works: the person
// gets a confirmation e-mail whose link comes back through /auth/callback.
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");

  // Only used when "Confirm email" is ON. Next.js checks the Server Action Origin
  // against Host, so this is the app's own address, never one from the form.
  const origin = (await headers()).get("origin");
  const emailRedirectTo = origin && /^https?:\/\//.test(origin)
    ? `${new URL(origin).origin}/auth/callback?next=/dashboard`
    : undefined;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName }, emailRedirectTo },
  });

  if (error) {
    redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`);
  }

  // "Confirm email" ON: no session yet — say so instead of bouncing to sign-in.
  if (!data.session) {
    redirect("/login?confirm=1");
  }

  // With "Confirm email" off, sign-up returns a session immediately.
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
