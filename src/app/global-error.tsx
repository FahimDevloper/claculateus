"use client";

import { useEffect } from "react";
import { logClientError } from "@/lib/admin/errorLogs";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logClientError(error.message, { stack: error.stack, path: typeof window !== "undefined" ? window.location.pathname : undefined });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ maxWidth: "24rem", fontSize: "0.875rem", color: "#6b7280" }}>
            The site hit an unexpected error. It&apos;s been logged, and trying again usually fixes it.
          </p>
          <button
            onClick={reset}
            style={{ background: "#6d28d9", color: "white", borderRadius: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
