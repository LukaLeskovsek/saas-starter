import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TestErrorButton } from "@/components/test-error-button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You&rsquo;re signed in. This is your app shell — make it yours.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>
            The worked example feature (form → table → list). Open it, learn the
            shape, then replace it with your own.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/feature" className={buttonVariants()}>
            Open requests
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production basics (demo)</CardTitle>
          <CardDescription>
            Throw a deliberate error and watch it land in your Sentry project.
            Delete this card before real customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestErrorButton />
        </CardContent>
      </Card>
    </div>
  );
}
