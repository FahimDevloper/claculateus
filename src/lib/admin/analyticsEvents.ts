import { addDoc, collection, getDocs, limit as fsLimit, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export type InternalEventType = "calculator_view" | "search";

export async function logInternalEvent(type: InternalEventType, payload: { slug?: string; title?: string; query?: string }) {
  try {
    await withTimeout(
      addDoc(collection(db, "analytics_events"), { type, ...payload, createdAt: serverTimestamp() }),
      3000
    );
  } catch {
    // Best-effort internal analytics — never block the UI on this.
  }
}

export interface EventRecord {
  id: string;
  type: InternalEventType;
  slug?: string;
  title?: string;
  query?: string;
  createdAt: number;
}

export async function getRecentEvents(max = 2000): Promise<EventRecord[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, "analytics_events"), orderBy("createdAt", "desc"), fsLimit(max))),
    6000
  );
  return snap.docs.map((d) => {
    const data = d.data() as {
      type: InternalEventType;
      slug?: string;
      title?: string;
      query?: string;
      createdAt?: Timestamp;
    };
    return {
      id: d.id,
      type: data.type,
      slug: data.slug,
      title: data.title,
      query: data.query,
      createdAt: data.createdAt?.toMillis() ?? 0,
    };
  });
}

/**
 * Real view counts per calculator from the last `days` days of logged
 * calculator_view events, most-viewed first. Returns an empty map (not
 * fabricated data) if Firestore is unreachable or no events exist yet —
 * callers should fall back to the static `popular` flag in that case.
 */
export async function getTrendingCounts(days = 30, max = 1000): Promise<Record<string, number>> {
  try {
    const events = await getRecentEvents(max);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const counts: Record<string, number> = {};
    for (const e of events) {
      if (e.type !== "calculator_view" || !e.slug || e.createdAt < cutoff) continue;
      counts[e.slug] = (counts[e.slug] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}
