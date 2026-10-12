import Link from "next/link";
import { ShieldCheck, Zap, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { brand } from "@/config/brand";

/*
  THE LANDING PAGE — the main thing you rebrand on Day 2.
  Ask Claude Code to rewrite the copy from your profile (PERSON.md, COMPANY.md,
  BRAND.md), set the name and tagline in config/brand.ts and the brand colour via
  --brand in app/globals.css. You should not need to touch the sign-in flow or
  anything in lib/.
*/
const FEATURES = [
  { icon: Zap, title: "Hitro v živo", body: "Predstavitvena stran, prijava in ena funkcija, že danes na internetu." },
  { icon: ShieldCheck, title: "Varno že na začetku", body: "Prijava in pravila v bazi, ki vsakemu pokažejo samo njegove podatke." },
  { icon: Boxes, title: "Tvoje, da raste", body: "Celotna aplikacija je tvoja in jo razširiš v katerokoli smer." },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-xs">
            {brand.name.charAt(0)}
          </span>
          {brand.name}
        </span>
        <Button variant="ghost" render={<Link href="/login" />}>
          Prijava
        </Button>
      </header>

      <main className="flex-1">
        {/* HERO — your product's promise in your customer's words */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              Narejeno v enem dnevu
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              {brand.tagline}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
              En stavek o tem, kaj stranka dobi od tebe. Zamenjaj ga s svojo pravo obljubo in
              jo povej čim bolj konkretno.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/login?mode=signup" />}>
                Začni
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/login" />}>
                Prijava
              </Button>
            </div>
          </div>
        </section>

        {/* What you get — a minimal strip */}
        <section className="mx-auto grid max-w-4xl gap-10 px-4 pb-24 sm:grid-cols-3 sm:px-6">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
