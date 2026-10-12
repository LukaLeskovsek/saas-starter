import { brand } from "@/config/brand";

// Rebrand: the footer line lives in config/brand.ts.
export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pt-10 pb-10 text-center text-sm text-muted-foreground sm:px-6">
      {brand.footer}
    </footer>
  );
}
