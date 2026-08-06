"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { allCalculators } from "@/lib/calculators/registry";
import { categories } from "@/lib/calculators/categories";
import { CalculatorDefinition } from "@/lib/calculators/types";
import { CategoryIcon, SearchIcon, StarIcon, GridIcon, ListIcon, FlameIcon, ClockIcon, PinIcon, XIcon } from "@/components/icons";
import { expandQuery } from "@/lib/search/synonyms";
import { fuzzyMatches } from "@/lib/search/fuzzy";
import { getFavoriteCalculators, toggleFavoriteCalculator, SYNC_EVENT, DATA_MERGED_EVENT } from "@/lib/storage";
import { logInternalEvent } from "@/lib/admin/analyticsEvents";

const NEW_SLUGS = new Set([
  "state-income-tax", "payroll-tax", "capital-gains-tax", "gift-tax", "tax-refund-estimator",
  "w2-tax", "1099-tax", "quarterly-estimated-tax", "bonus-tax", "overtime-tax",
  "effective-tax-rate", "marginal-tax-rate", "llc-tax", "s-corp-tax", "corporate-tax", "customs-duty",
]);

const CATEGORY_COLOR: Record<string, string> = {
  financial: "primary",
  tax: "warning",
  health: "accent2",
  math: "success",
  everyday: "accent",
  conversion: "danger",
};

type FilterKey = "all" | "popular" | "trending" | "new" | "favorites";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "popular", label: "Popular" },
  { key: "trending", label: "Trending" },
  { key: "new", label: "New" },
  { key: "favorites", label: "Favorites" },
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function displayLabel(def: CalculatorDefinition): string {
  return def.shortTitle ?? def.title;
}

function estimateTime(def: CalculatorDefinition): string {
  const n = def.fields.length;
  if (n <= 2) return "~30 sec";
  if (n <= 5) return "~1 min";
  return "~2 min";
}

function badgeClasses(color: string) {
  return `bg-[color-mix(in_oklab,var(--${color})_14%,transparent)] text-[color-mix(in_oklab,var(--${color})_85%,black)]`;
}

interface Props {
  overrides: Record<string, { featured?: boolean }>;
  trendingCounts: Record<string, number>;
}

export default function CalculatorExplorer({ overrides, trendingCounts }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [letter, setLetter] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFavorites(getFavoriteCalculators());
    function refresh() {
      setFavorites(getFavoriteCalculators());
    }
    window.addEventListener(SYNC_EVENT, refresh);
    window.addEventListener(DATA_MERGED_EVENT, refresh);
    return () => {
      window.removeEventListener(SYNC_EVENT, refresh);
      window.removeEventListener(DATA_MERGED_EVENT, refresh);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isTyping = ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName);
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pinned = useMemo(
    () => allCalculators.filter((c) => overrides[c.slug]?.featured === true).slice(0, 6),
    [overrides]
  );

  const filtered = useMemo(() => {
    let list = allCalculators;

    if (category !== "all") list = list.filter((c) => c.category === category);

    const q = query.trim().toLowerCase();
    if (q) {
      const expanded = expandQuery(q);
      const exact = list.filter((c) => {
        const hay = `${c.title} ${c.shortTitle ?? ""} ${(c.keywords ?? []).join(" ")}`.toLowerCase();
        return expanded.some((t) => hay.includes(t));
      });
      list = exact.length > 0 || q.length < 3 ? exact : list.filter((c) => fuzzyMatches(q, c.title.toLowerCase()));
    }

    if (letter) list = list.filter((c) => displayLabel(c).toUpperCase().startsWith(letter));

    if (filter === "popular") {
      list = list.filter((c) => c.popular || overrides[c.slug]?.featured);
    } else if (filter === "favorites") {
      list = list.filter((c) => favorites.includes(c.slug));
    } else if (filter === "new") {
      list = list.filter((c) => NEW_SLUGS.has(c.slug));
    } else if (filter === "trending") {
      const trendingSlugs = Object.keys(trendingCounts);
      list = trendingSlugs.length > 0 ? list.filter((c) => trendingCounts[c.slug] > 0) : list.filter((c) => c.popular);
    }

    const sorted = [...list].sort((a, b) => {
      if (filter === "trending" && Object.keys(trendingCounts).length > 0) {
        return (trendingCounts[b.slug] ?? 0) - (trendingCounts[a.slug] ?? 0);
      }
      return displayLabel(a).localeCompare(displayLabel(b));
    });
    return sorted;
  }, [category, query, letter, filter, favorites, overrides, trendingCounts]);

  const usingFallbackTrending = filter === "trending" && Object.keys(trendingCounts).length === 0;

  function onGridKeyDown(e: React.KeyboardEvent) {
    const cols = view === "grid" ? (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1) : 1;
    if (e.key === "ArrowRight") { e.preventDefault(); setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setFocusedIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex((i) => Math.min(i + cols, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIndex((i) => Math.max(i - cols, 0)); }
    else if (e.key === "Home") { e.preventDefault(); setFocusedIndex(0); }
    else if (e.key === "End") { e.preventDefault(); setFocusedIndex(filtered.length - 1); }
  }

  useEffect(() => {
    if (focusedIndex < 0) return;
    const el = gridRef.current?.querySelectorAll<HTMLElement>("[data-explorer-card]")[focusedIndex];
    el?.focus();
  }, [focusedIndex]);

  function toggleFav(slug: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(toggleFavoriteCalculator(slug));
  }

  function handleSearchChange(v: string) {
    setQuery(v);
  }

  function trackSelect(slug: string) {
    if (query.trim()) logInternalEvent("search", { query: query.trim(), slug });
  }

  return (
    <section className="container-wide py-16">
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Calculator explorer</span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Every calculator, one search away</h2>
        <p className="max-w-2xl text-muted">
          {allCalculators.length}+ calculators across {categories.length} categories — search, filter, and jump straight to the one you need.
        </p>
      </div>

      {pinned.length > 0 && filter === "all" && category === "all" && !query && !letter && (
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
            <PinIcon width={13} height={13} />
            Pinned by the team
          </div>
          <div className="flex flex-wrap gap-2">
            {pinned.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] px-3.5 py-1.5 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
              >
                {c.shortTitle ?? c.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky search + controls */}
      <div className="sticky top-16 z-30 -mx-1 mb-5 rounded-2xl border border-border bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] p-3 backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--surface)_75%,transparent)]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 focus-within:border-primary">
              <SearchIcon width={16} height={16} className="shrink-0 text-muted" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search 220+ calculators… (press / to focus)"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
                aria-label="Search calculators"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search" className="text-muted hover:text-foreground">
                  <XIcon width={14} height={14} />
                </button>
              )}
            </div>
            <div className="hidden shrink-0 items-center gap-1 rounded-lg border border-border bg-surface p-1 sm:flex">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={`rounded-md p-1.5 transition ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"}`}
              >
                <GridIcon width={15} height={15} />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
                className={`rounded-md p-1.5 transition ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"}`}
              >
                <ListIcon width={15} height={15} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filter === f.key ? "bg-primary text-primary-foreground" : "border border-border text-muted hover:text-foreground"
                }`}
              >
                {f.key === "trending" && <FlameIcon width={12} height={12} />}
                {f.label}
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-border" />
            <button
              onClick={() => setCategory("all")}
              aria-pressed={category === "all"}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                category === "all" ? "bg-foreground text-background" : "border border-border text-muted hover:text-foreground"
              }`}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                aria-pressed={category === c.slug}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  category === c.slug ? "bg-foreground text-background" : "border border-border text-muted hover:text-foreground"
                }`}
              >
                <CategoryIcon icon={c.icon} width={12} height={12} />
                {c.title}
              </button>
            ))}
          </div>

          <div className="scrollbar-thin flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setLetter(null)}
              className={`flex min-h-6 shrink-0 items-center justify-center rounded-md px-1.5 text-[11px] font-bold ${letter === null ? "text-primary" : "text-muted hover:text-foreground"}`}
            >
              A–Z
            </button>
            {LETTERS.map((l) => (
              <button
                key={l}
                onClick={() => setLetter(letter === l ? null : l)}
                className={`flex min-h-6 min-w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold transition ${
                  letter === l ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {usingFallbackTrending && (
        <p className="mb-3 text-xs text-muted">Trending data is still collecting real visits — showing popular calculators for now.</p>
      )}
      <p className="mb-3 font-mono text-xs text-muted">{filtered.length} calculator{filtered.length === 1 ? "" : "s"}</p>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-12 text-center">
          <span className="text-3xl">🔍</span>
          <p className="font-semibold text-foreground">
            {filter === "favorites" ? "No favorites yet" : "No calculators match"}
          </p>
          <p className="max-w-sm text-sm text-muted">
            {filter === "favorites"
              ? "Tap the star on any calculator to save it here for quick access."
              : "Try a different search term, or clear your filters."}
          </p>
        </div>
      ) : (
        <div
          ref={gridRef}
          onKeyDown={onGridKeyDown}
          className={view === "grid" ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-2"}
        >
          <AnimatePresence initial={false}>
            {filtered.slice(0, 60).map((c, i) => {
              const isFav = favorites.includes(c.slug);
              const views = trendingCounts[c.slug];
              const color = CATEGORY_COLOR[c.category] ?? "primary";
              return (
                <motion.div
                  key={c.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link
                    href={`/calculators/${c.slug}`}
                    onClick={() => trackSelect(c.slug)}
                    data-explorer-card
                    tabIndex={0}
                    onFocus={() => setFocusedIndex(i)}
                    className={`card group flex outline-none transition hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-md)] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                      view === "grid" ? "h-full flex-col gap-2.5 p-4" : "items-center gap-3 p-3"
                    }`}
                  >
                    <div className={`flex items-center justify-between ${view === "list" ? "w-40 shrink-0" : ""}`}>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClasses(color)}`}>
                        <CategoryIcon icon={categories.find((cat) => cat.slug === c.category)?.icon ?? "wallet"} width={10} height={10} />
                        {c.category}
                      </span>
                      <button
                        onClick={(e) => toggleFav(c.slug, e)}
                        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                        className={`rounded-full p-1 transition ${isFav ? "text-warning" : "text-muted opacity-0 hover:text-warning group-hover:opacity-100 group-focus-within:opacity-100"}`}
                      >
                        <StarIcon width={14} height={14} filled={isFav} />
                      </button>
                    </div>
                    <div className={view === "list" ? "min-w-0 flex-1" : ""}>
                      <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">{c.shortTitle ?? c.title}</p>
                      {view === "grid" && <p className="mt-1 line-clamp-2 text-xs text-muted">{c.description}</p>}
                    </div>
                    <div className={`flex items-center gap-3 text-[11px] text-muted ${view === "grid" ? "mt-auto pt-1" : "shrink-0"}`}>
                      <span className="flex items-center gap-1">
                        <ClockIcon width={11} height={11} />
                        {estimateTime(c)}
                      </span>
                      {!!views && (
                        <span className="flex items-center gap-1">
                          <FlameIcon width={11} height={11} />
                          {views} view{views === 1 ? "" : "s"}
                        </span>
                      )}
                      {NEW_SLUGS.has(c.slug) && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${badgeClasses("success")}`}>NEW</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      {filtered.length > 60 && (
        <p className="mt-4 text-center text-xs text-muted">
          Showing the first 60 of {filtered.length} — narrow your search or filters to find more.
        </p>
      )}
    </section>
  );
}
