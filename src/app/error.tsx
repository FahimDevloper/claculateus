"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logClientError } from "@/lib/admin/errorLogs";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logClientError(error.message, { stack: error.stack, path: typeof window !== "undefined" ? window.location.pathname : undefined });
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted">
        This page hit an unexpected error. It's been logged, and trying again usually fixes it.
      </p>
      <div className="mt-2 flex gap-3">
        <button onClick={reset} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold">
          Try again
        </button>
        <Link href="/" className="btn-ghost rounded-lg px-4 py-2 text-sm font-semibold">
          Back to Calculateus
        </Link>
      </div>
    </div>
  );
}
