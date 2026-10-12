import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { TestErrorButton } from "@/components/test-error-button";
import { sl } from "@/lib/i18n/sl";

export const metadata = { title: sl.dashboard.title };

export default function DashboardPage() {
  const t = sl.dashboard;
  return (
    <div>
      <PageHeader title={t.title} description={t.text} />

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="size-4 text-primary" />
              {t.requestsTitle}
            </CardTitle>
            <CardDescription>{t.requestsText}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/feature" />}>{t.requestsOpen}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.sentryTitle}</CardTitle>
            <CardDescription>{t.sentryText}</CardDescription>
          </CardHeader>
          <CardContent>
            <TestErrorButton label={t.sentryButton} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
