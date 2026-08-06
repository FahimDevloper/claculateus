"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EventRecord, getRecentEvents } from "@/lib/admin/analyticsEvents";

const WINDOW_OPTIONS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "All logged events", days: null },
];

function topCounts(entries: [string, number][], max: number) {
  return entries.sort((a, b) => b[1] - a[1]).slice(0, max);
}

export default function AnalyticsPage() {
  const [events, setEvents] = useState<EventRecord[] | null>(null);
  const [windowDays, setWindowDays] = useState<number | null>(30);

  useEffect(() => {
    getRecentEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  const scoped = useMemo(() => {
    if (!events) return [];
    if (windowDays === null) return events;
    const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
    return events.filter((e) => e.createdAt >= cutoff);
  }, [events, windowDays]);

  const topCalculators = useMemo(() => {
    const counts = new Map<string, { title: string; count: number }>();
    for (const e of scoped) {
      if (e.type !== "calculator_view" || !e.slug) continue;
      const entry = counts.get(e.slug) ?? { title: e.title ?? e.slug, count: 0 };
      entry.count += 1;
      counts.set(e.slug, entry);
    }
    return topCounts([...counts.entries()].map(([slug, v]) => [slug, v.count] as [string, number]), 15).map(
      ([slug, count]) => ({ slug, count, title: counts.get(slug)!.title })
    );
  }, [scoped]);

  const topSearches = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of scoped) {
      if (e.type !== "search" || !e.query) continue;
      const key = e.query.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return topCounts([...counts.entries()], 15);
  }, [scoped]);

  const totalViews = scoped.filter((e) => e.type === "calculator_view").length;
  const totalSearches = scoped.filter((e) => e.type === "search").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          This is real, internally-logged usage — every calculator view and completed on-site search is written
          to Firestore, and these numbers are read straight back from it. For full traffic analytics (sessions,
          referrers, geography, device breakdowns), the site also sends events to Google Analytics via Firebase —
          view that in the Firebase Console under Analytics.
        </p>
      </div>

      <div className="flex gap-2">
        {WINDOW_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setWindowDays(opt.days)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              windowDays === opt.days ? "bg-primary text-primary-foreground" : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {events === null ? (
        <div className="flex min-h-[20vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Calculator views logged</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{totalViews}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Searches logged</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{totalSearches}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-sm font-bold text-foreground">Most-viewed calculators</h3>
              {topCalculators.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No views logged in this window yet.</p>
              ) : (
                <div className="mt-4 flex flex-col divide-y divide-border">
                  {topCalculators.map((c) => (
                    <Link key={c.slug} href={`/calculators/${c.slug}`} target="_blank" className="flex items-center justify-between py-2.5 text-sm hover:text-primary">
                      <span className="text-foreground">{c.title}</span>
                      <span className="font-mono text-xs text-muted">{c.count}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-bold text-foreground">Top searches</h3>
              {topSearches.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No searches logged in this window yet.</p>
              ) : (
                <div className="mt-4 flex flex-col divide-y divide-border">
                  {topSearches.map(([q, count]) => (
                    <div key={q} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-foreground">{q}</span>
                      <span className="font-mono text-xs text-muted">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
