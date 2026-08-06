"use client";

import { useEffect, useState } from "react";
import { ErrorLogRecord, getRecentErrors } from "@/lib/admin/errorLogs";

export default function ErrorsPage() {
  const [errors, setErrors] = useState<ErrorLogRecord[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getRecentErrors().then(setErrors).catch(() => setErrors([]));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Error Log</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Unhandled render errors and JavaScript errors from real visitors, logged directly to Firestore — no
          third-party monitoring service required. Most recent 200 shown.
        </p>
      </div>

      {errors === null ? (
        <div className="flex min-h-[20vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : errors.length === 0 ? (
        <div className="card p-8 text-center text-sm text-muted">No errors logged yet — that's a good sign.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex flex-col divide-y divide-border">
            {errors.map((e) => (
              <div key={e.id} className="flex flex-col gap-1.5 px-5 py-3">
                <button
                  onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                  className="flex items-start justify-between gap-4 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-danger">{e.message}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {e.path && <span className="font-mono">{e.path}</span>}
                      {e.path && " · "}
                      {new Date(e.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className="shrink-0 text-muted">{expanded === e.id ? "▴" : "▾"}</span>
                </button>
                {expanded === e.id && (
                  <div className="mt-1 flex flex-col gap-2 rounded-lg bg-surface-2 p-3">
                    {e.stack && (
                      <pre className="scrollbar-thin overflow-x-auto whitespace-pre-wrap text-xs text-muted">{e.stack}</pre>
                    )}
                    {e.userAgent && <p className="text-xs text-muted">{e.userAgent}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
