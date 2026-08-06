"use client";

import { useEffect } from "react";
import { logClientError } from "@/lib/admin/errorLogs";

export default function ErrorReporter() {
  useEffect(() => {
    function onError(event: ErrorEvent) {
      logClientError(event.message, { stack: event.error?.stack, path: window.location.pathname });
    }
    function onRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : undefined;
      logClientError(`Unhandled promise rejection: ${message}`, { stack, path: window.location.pathname });
    }
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
