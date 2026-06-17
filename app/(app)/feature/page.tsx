import { createClient } from "@/lib/supabase/server";
import { createRequest } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// The worked example feature: form → table → list, scoped per-user by RLS.
// REPLACE THIS with your own feature, keeping the same shape.
export default async function FeaturePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;

  const supabase = await createClient();
  // RLS guarantees this only ever returns the signed-in user's own rows.
  const { data: requests } = await supabase
    .from("requests")
    .select("id, name, message, amount, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Requests</h1>
        <p className="mt-1 text-muted">
          The form writes to a table (owner-only via RLS); the list shows only
          your rows.
        </p>
      </div>

      <Card>
        <h2 className="text-lg font-medium">New request</h2>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        {ok ? (
          <p className="mt-2 text-sm text-green-600">
            Saved. Check your email for the confirmation.
          </p>
        ) : null}
        <form action={createRequest} className="mt-4 space-y-4">
          <Input name="name" placeholder="Name" required />
          <textarea
            name="message"
            placeholder="Message"
            required
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
          />
          <Input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount (optional)"
          />
          <Button type="submit">Submit request</Button>
        </form>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Your requests</h2>
        {requests && requests.length > 0 ? (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li key={r.id}>
                <Card>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.name}</span>
                    {r.amount != null ? (
                      <span className="text-sm text-muted">{r.amount}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">{r.message}</p>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No requests yet. Submit one above.</p>
        )}
      </div>
    </div>
  );
}
