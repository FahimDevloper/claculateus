"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { allCalculators } from "@/lib/calculators/registry";
import { SearchIcon } from "@/components/icons";
import { addRecentSearch } from "@/lib/storage";
import { expandQuery } from "@/lib/search/synonyms";
import { fuzzyMatches } from "@/lib/search/fuzzy";
import { logInternalEvent } from "@/lib/admin/analyticsEvents";

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const expandedTerms = expandQuery(q);
    const exact = allCalculators
      .map((c) => {
        const title = c.title.toLowerCase();
        const keywords = (c.keywords ?? []).join(" ").toLowerCase();
        const matchesAny = expandedTerms.some((t) => title.includes(t) || keywords.includes(t));
        if (!matchesAny) return null;
        const score = title.startsWith(q) ? 3 : title.includes(q) ? 2 : 1;
        return { calc: c, score };
      })
      .filter((r): r is { calc: (typeof allCalculators)[number]; score: number } => r !== null);

    if (exact.length > 0) {
      return exact.sort((a, b) => b.score - a.score).slice(0, 8).map((r) => r.calc);
    }
    if (q.length < 3) return [];
    return allCalculators.filter((c) => fuzzyMatches(q, c.title.toLowerCase())).slice(0, 8);
  }, [query]);

  return (
    <div className="relative mx-auto max-w-lg">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm focus-within:border-primary focus-within:ring-3 focus-within:ring-[color-mix(in_oklab,var(--primary)_20%,transparent)]">
        <SearchIcon className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Try “mortgage”, “BMI”, “percentage”…"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
      </div>
      {focused && results.length > 0 && (
        <div className="card absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden text-left shadow-xl animate-fade-in">
          {results.map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              onClick={() => {
                if (query.trim()) {
                  addRecentSearch(query);
                  logInternalEvent("search", { query: query.trim(), slug: c.slug });
                }
              }}
              className="block px-4 py-2.5 text-sm text-foreground hover:bg-surface-2"
            >
              {c.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
