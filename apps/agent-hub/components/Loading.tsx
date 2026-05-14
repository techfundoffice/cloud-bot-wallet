"use client";

import { LoadingSpinner } from "@coinbase/cdp-react/components/ui/LoadingSpinner";

export function Loading() {
  return (
    <main className="loading-screen">
      <h1 className="sr-only">Loading</h1>
      <LoadingSpinner />
    </main>
  );
}
