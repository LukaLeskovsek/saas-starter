import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

/*
  THE LANDING PAGE — this is the main thing you rebrand on Day 2.
  Ask Claude Code to rewrite the copy from your PERSON.md / COMPANY.md / BRAND.md.
  Change the words and the brand tokens in app/globals.css. You should not need
  to touch the sign-in flow or anything in lib/.
*/
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        {/* Rebrand: your product name */}
        <span className="font-semibold">SaaS Starter</span>
        <Link href="/login">
          <Button variant="secondary">Sign in</Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* HERO — your product's promise in your customer's words */}
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Your product&rsquo;s promise in one line
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            One clear sentence about the outcome you give your customer. Replace
            this with your real value proposition.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/login?mode=signup">
              <Button>Get started</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </div>
        </section>

        {/* FEATURES — three concrete benefits */}
        <section className="mx-auto grid max-w-4xl gap-6 px-6 pb-24 sm:grid-cols-3">
          {[
            { title: "Benefit one", body: "What the customer gets. Keep it concrete." },
            { title: "Benefit two", body: "Another outcome, in their language." },
            { title: "Benefit three", body: "The third reason they stay." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border p-6">
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
