import { Inbox, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createRequest } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { formatMoney, formatRelative } from "@/lib/format";
import { sl } from "@/lib/i18n/sl";

export const metadata = { title: sl.requests.title };

// The worked example feature: form → table → AI call → list, scoped per-user by
// RLS. The AI triages each request and drafts a reply (lib/ai.ts → OpenRouter).
// REPLACE THIS with your own AI feature, keeping the same shape.
export default async function FeaturePage() {
  const t = sl.requests;
  const supabase = await createClient();
  // RLS guarantees this only ever returns the signed-in user's own rows.
  const { data: requests } = await supabase
    .from("requests")
    .select("id, name, message, amount, ai_draft, created_at")
    .order("created_at", { ascending: false });
  const rows = requests ?? [];

  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.text} className="mb-0" />

      <Card>
        <CardHeader>
          <CardTitle>{t.newTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRequest} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input id="name" name="name" required maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t.message}</Label>
              <Textarea id="message" name="message" required rows={3} maxLength={4000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">
                {t.amount} <span className="font-normal text-muted-foreground">({sl.common.optional})</span>
              </Label>
              <Input id="amount" name="amount" type="number" inputMode="decimal" step="0.01" min="0" className="max-w-48" />
            </div>
            <SubmitButton size="lg" pendingText={t.submitting}>
              {t.submit}
            </SubmitButton>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">{t.listTitle}</h2>
        {rows.length > 0 ? (
          <div className="space-y-3">
            {rows.map((r) => (
              <Card key={r.id} size="sm">
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium">{r.name}</div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{r.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatRelative(r.created_at)}</p>
                    </div>
                    {r.amount != null ? (
                      <span className="shrink-0 font-semibold tabular-nums">{formatMoney(Number(r.amount))}</span>
                    ) : null}
                  </div>
                  {r.ai_draft ? (
                    <div className="rounded-xl bg-accent/60 p-3 text-accent-foreground">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Sparkles className="size-3.5" />
                        {t.aiTitle}
                      </div>
                      <p className="mt-1 text-sm whitespace-pre-line opacity-90">{r.ai_draft}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState icon={Inbox} title={t.empty}>
            {t.emptyText}
          </EmptyState>
        )}
      </section>
    </div>
  );
}
