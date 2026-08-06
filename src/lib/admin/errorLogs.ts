import { addDoc, collection, getDocs, limit as fsLimit, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

const MAX_FIELD_LENGTH = 2000;

function truncate(s: string): string {
  return s.length > MAX_FIELD_LENGTH ? s.slice(0, MAX_FIELD_LENGTH) : s;
}

export async function logClientError(message: string, opts: { stack?: string; path?: string } = {}) {
  try {
    await withTimeout(
      addDoc(collection(db, "error_logs"), {
        message: truncate(message || "Unknown error"),
        stack: opts.stack ? truncate(opts.stack) : "",
        path: opts.path ? truncate(opts.path) : "",
        userAgent: typeof navigator !== "undefined" ? truncate(navigator.userAgent) : "",
        createdAt: serverTimestamp(),
      }),
      3000
    );
  } catch {
    // Best-effort — never let logging itself break the page further.
  }
}

export interface ErrorLogRecord {
  id: string;
  message: string;
  stack: string;
  path: string;
  userAgent: string;
  createdAt: number;
}

export async function getRecentErrors(max = 200): Promise<ErrorLogRecord[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, "error_logs"), orderBy("createdAt", "desc"), fsLimit(max))),
    6000
  );
  return snap.docs.map((d) => {
    const data = d.data() as { message?: string; stack?: string; path?: string; userAgent?: string; createdAt?: Timestamp };
    return {
      id: d.id,
      message: data.message ?? "",
      stack: data.stack ?? "",
      path: data.path ?? "",
      userAgent: data.userAgent ?? "",
      createdAt: data.createdAt?.toMillis() ?? 0,
    };
  });
}
