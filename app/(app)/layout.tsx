import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToastFromParams } from "@/components/toast-from-params";

// Auth guard for the whole signed-in area. DONE — do not modify.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = (user.user_metadata?.full_name as string | undefined) || user.email || "";

  return (
    <div className="flex min-h-screen flex-col">
      <Header name={name} email={user.email} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <Footer />
      <Suspense>
        <ToastFromParams />
      </Suspense>
    </div>
  );
}
