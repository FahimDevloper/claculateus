"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { allCalculators } from "@/lib/calculators/registry";
import { categories } from "@/lib/calculators/categories";
import { SearchIcon, XIcon, MicIcon, CategoryIcon } from "@/components/icons";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "@/lib/storage";
import { expandQuery } from "@/lib/search/synonyms";
import { fuzzyMatches } from "@/lib/search/fuzzy";
import { logInternalEvent } from "@/lib/admin/analyticsEvents";

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-[color-mix(in_oklab,var(--primary)_25%,transparent)] text-inherit">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface SpeechRecognitionLike {
  start: () => void;
  onresult: ((e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  lang: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const voiceSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setActiveCategory(null);
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = activeCategory ? allCalculators.filter((c) => c.category === activeCategory) : allCalculators;
    if (!q) return pool.filter((c) => c.popular).slice(0, 8);

    const expandedTerms = expandQuery(q);

    const exact = pool
      .map((c) => {
        const title = c.title.toLowerCase();
        const keywords = (c.keywords ?? []).join(" ").toLowerCase();
        const haystack = `${title} ${c.description.toLowerCase()} ${keywords}`;
        const matchesAny = expandedTerms.some((term) => haystack.includes(term));
        if (!matchesAny) return null;
        let score = 0;
        if (title === q) score = 100;
        else if (title.startsWith(q)) score = 80;
        else if (title.includes(q)) score = 60;
        else if (expandedTerms.some((t) => keywords.includes(t))) score = 40;
        else score = 20;
        return { calc: c, score };
      })
      .filter((r): r is { calc: (typeof allCalculators)[number]; score: number } => r !== null);

    if (exact.length > 0) {
      return exact.sort((a, b) => b.score - a.score).slice(0, 20).map((r) => r.calc);
    }

    // No exact/synonym matches — fall back to typo-tolerant fuzzy matching on titles.
    if (q.length < 3) return [];
    return pool.filter((c) => fuzzyMatches(q, c.title.toLowerCase())).slice(0, 10);
  }, [query, activeCategory]);

  function go(slug: string, searchTerm?: string) {
    if (searchTerm) {
      setRecentSearches(addRecentSearch(searchTerm));
      logInternalEvent("search", { query: searchTerm, slug });
    }
    setOpen(false);
    router.push(`/calculators/${slug}`);
  }

  function startVoiceSearch() {
    const Ctor = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    setListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search calculators"
        className="btn-ghost flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-muted"
      >
        <SearchIcon width={16} height={16} />
        <span className="hidden sm:inline">Search calculators…</span>
        <kbd className="ml-1 hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted sm:inline">
          Ctrl K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[10vh] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="glass w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
                <SearchIcon width={18} height={18} className="text-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter" && results[activeIndex]) {
                      go(results[activeIndex].slug, query);
                    }
                  }}
                  placeholder="Search 200+ calculators…"
                  aria-label="Search calculators"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    aria-label="Voice search"
                    className={`transition ${listening ? "text-primary" : "text-muted hover:text-foreground"}`}
                  >
                    <MicIcon width={16} height={16} />
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)} aria-label="Close search" className="text-muted hover:text-foreground">
                  <XIcon width={16} height={16} />
                </button>
              </div>

              <div className="scrollbar-thin flex gap-1.5 overflow-x-auto border-b border-border/60 px-3 py-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${activeCategory === null ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted hover:text-foreground"}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setActiveCategory(c.slug)}
                    className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${activeCategory === c.slug ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted hover:text-foreground"}`}
                  >
                    <CategoryIcon icon={c.icon} width={12} height={12} />
                    {c.title}
                  </button>
                ))}
              </div>

              {!query && recentSearches.length > 0 && (
                <div className="flex items-center justify-between px-4 pt-3">
                  <span className="text-xs font-semibold text-muted">Recent searches</span>
                  <button onClick={() => setRecentSearches(clearRecentSearches())} className="text-xs text-muted hover:text-danger">Clear</button>
                </div>
              )}
              {!query && recentSearches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-4 pb-1 pt-2">
                  {recentSearches.map((s) => (
                    <button key={s} onClick={() => setQuery(s)} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted hover:border-primary hover:text-primary">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="scrollbar-thin max-h-96 overflow-y-auto p-2">
                {!query && <p className="px-3 pb-1 pt-2 text-xs font-semibold text-muted">Popular</p>}
                {results.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-muted">No calculators found.</p>
                ) : (
                  results.map((c, i) => {
                    const cat = categories.find((cat) => cat.slug === c.category);
                    return (
                      <button
                        key={c.slug}
                        onClick={() => go(c.slug, query)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                          i === activeIndex ? "bg-surface-2" : ""
                        }`}
                      >
                        <span className="font-medium text-foreground">{highlight(c.title, query)}</span>
                        <span className="text-xs text-muted">{cat?.title}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
