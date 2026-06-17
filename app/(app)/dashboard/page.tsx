import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestErrorButton } from "@/components/test-error-button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-muted">
          You are signed in. This is your app shell — make it yours.
        </p>
      </div>

      {/* Feature slot — links to the worked example. Replace "Requests" with your feature. */}
      <Card>
        <h2 className="text-lg font-medium">Requests</h2>
        <p className="mt-1 text-sm text-muted">
          The worked example feature (form → table → list). Open it, learn the
          shape, then replace it with your own.
        </p>
        <Link href="/feature" className="mt-4 inline-block">
          <Button>Open requests</Button>
        </Link>
      </Card>

      {/* DEMO ONLY — Day 2 "production basics". Delete before real customers. */}
      <Card>
        <h2 className="text-lg font-medium">Production basics (demo)</h2>
        <p className="mt-1 text-sm text-muted">
          Throw a deliberate error and watch it land in your Sentry project.
        </p>
        <div className="mt-4">
          <TestErrorButton />
        </div>
      </Card>
    </div>
  );
}
