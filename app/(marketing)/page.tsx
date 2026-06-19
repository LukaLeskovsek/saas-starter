import Link from "next/link";
import { ShieldCheck, Zap, Boxes } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Footer } from "@/components/footer";

/*
  THE LANDING PAGE — the main thing you rebrand on Day 2.
  Ask Claude Code to rewrite the copy from your PERSON.md / COMPANY.md / BRAND.md,
  and set your brand colour via --primary in app/globals.css. You should not need
  to touch the sign-in flow or anything in lib/.
*/
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        {/* Rebrand: your product name / logo */}
        <span className="text-sm font-semibold tracking-tight">SaaS Starter</span>
        <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Sign in
        </Link>
      </header>

      <main className="flex-1">
        {/* HERO — your product's promise in your customer's words */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28">
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              Built in a day
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Your product&rsquo;s promise, in one clear line
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
              One sentence about the outcome you give your customer. Replace this with
              your real value proposition — make it concrete.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/login?mode=signup" className={buttonVariants({ size: "lg" })}>
                Get started
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* What you get — minimal, cardless strip */}
        <section className="mx-auto grid max-w-4xl gap-10 px-6 pb-24 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Ship fast", body: "Branded landing, sign-in, and one feature — live today." },
            { icon: ShieldCheck, title: "Secure by default", body: "Managed auth and row-level security, wired in." },
            { icon: Boxes, title: "Yours to grow", body: "Own the whole stack and extend it any direction." },
          ].map((f) => (
            <div key={f.title}>
              <f.icon className="size-5 text-foreground" />
              <h3 className="mt-3 text-sm font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
