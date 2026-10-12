import Link from "next/link";
import { brand } from "@/config/brand";
import { UserMenu } from "@/components/app/user-menu";
import { sl } from "@/lib/i18n/sl";

// The signed-in header: your brand on the left, the pages in the middle, the
// account menu (theme, sign out) on the right. Add a link when you add a page.
const NAV = [
  { href: "/dashboard", label: sl.dashboard.title },
  { href: "/feature", label: sl.requests.title },
];

export function Header({ name, email }: { name: string; email?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-xs">
            {brand.name.charAt(0)}
          </span>
          <span className="max-sm:hidden">{brand.name}</span>
        </Link>
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <UserMenu name={name} email={email} />
      </div>
    </header>
  );
}
