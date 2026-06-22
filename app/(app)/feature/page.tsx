import { createClient } from "@/lib/supabase/server";
import { createRequest } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// The worked example feature: form → table → AI call → list, scoped per-user by
// RLS. The AI triages each request and drafts a reply (lib/ai.ts → OpenRouter).
// REPLACE THIS with your own AI feature, keeping the same shape.
export default async function FeaturePage() {
  const supabase = await createClient();
  // RLS guarantees this only ever returns the signed-in user's own rows.
  const { data: requests } = await supabase
    .from("requests")
    .select("id, name, message, amount, ai_draft, created_at")
    .order("created_at", { ascending: false });
  const rows = requests ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The form writes to a table (owner-only via RLS); AI triages each request and
          drafts a reply; the list shows only your rows.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New request</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRequest} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                required
                rows={3}
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (optional)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0" />
            </div>
            <SubmitButton pendingText="Submitting…">Submit request</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Your requests</h2>
        {rows.length > 0 ? (
          <div className="space-y-3">
            {rows.map((r) => (
              <Card key={r.id} size="sm">
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{r.message}</p>
                    </div>
                    {r.amount != null ? (
                      <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                        {r.amount}
                      </span>
                    ) : null}
                  </div>
                  {r.ai_draft ? (
                    <div className="rounded-md border border-border bg-muted/40 p-3">
                      <div className="text-xs font-medium uppercase tracking-wide text-primary">
                        AI triage + suggested reply
                      </div>
                      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                        {r.ai_draft}
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No requests yet. Submit your first one above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
