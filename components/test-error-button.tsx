"use client";

import { Button } from "@/components/ui/button";

// FACILITATOR / DEMO ONLY — delete this before going to real customers.
// Day 2 "production basics": click it to throw a deliberate error and watch it
// appear in your Sentry project, with a readable stack trace.
export function TestErrorButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        throw new Error("Sentry test error — thrown from the dashboard");
      }}
    >
      Trigger a test error
    </Button>
  );
}
