import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Auth guard for the whole signed-in area. DONE — do not modify.
// Any route under (app) is only reachable with a valid session; otherwise we
// redirect to /login. This runs on the server on every request.
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header email={user.email} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
