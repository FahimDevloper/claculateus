export interface HistoryEntry {
  id: string;
  mode: "basic" | "scientific" | "finance" | "convert";
  expression: string;
  result: string;
  timestamp: number;
}

const HISTORY_KEY = "calculateus:calc-history";
const MEMORY_KEY = "calculateus:calc-memory";
const RECENT_CALCS_KEY = "calculateus:recent-calculators";
const FAVORITE_CALCS_KEY = "calculateus:favorite-calculators";
const RECENT_SEARCHES_KEY = "calculateus:recent-searches";
const SCENARIOS_KEY = "calculateus:scenarios";
const MAX_HISTORY = 50;
const MAX_RECENTS = 12;
const MAX_RECENT_SEARCHES = 8;
const MAX_SCENARIOS_PER_CALC = 6;
const MAX_SCENARIO_CALCS = 24;

export const SYNC_EVENT = "calculateus:storage-changed";
export const DATA_MERGED_EVENT = "calculateus:data-merged";

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

function notifyChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function getHistory(): HistoryEntry[] {
  return safeGet<HistoryEntry[]>(HISTORY_KEY, []);
}

export function addHistoryEntry(entry: Omit<HistoryEntry, "id" | "timestamp">): HistoryEntry[] {
  const next: HistoryEntry = { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: Date.now() };
  const updated = [next, ...getHistory()].slice(0, MAX_HISTORY);
  safeSet(HISTORY_KEY, updated);
  notifyChange();
  return updated;
}

export function setHistory(entries: HistoryEntry[]) {
  const capped = entries.slice(0, MAX_HISTORY);
  safeSet(HISTORY_KEY, capped);
  return capped;
}

export function clearHistory(): HistoryEntry[] {
  safeSet(HISTORY_KEY, []);
  notifyChange();
  return [];
}

export function getMemory(): number {
  return safeGet<number>(MEMORY_KEY, 0);
}

export function setMemory(value: number) {
  safeSet(MEMORY_KEY, value);
  notifyChange();
}

export function getRecentCalculators(): string[] {
  return safeGet<string[]>(RECENT_CALCS_KEY, []);
}

export function addRecentCalculator(slug: string) {
  const current = getRecentCalculators().filter((s) => s !== slug);
  const updated = [slug, ...current].slice(0, MAX_RECENTS);
  safeSet(RECENT_CALCS_KEY, updated);
  notifyChange();
  return updated;
}

export function setRecentCalculators(slugs: string[]) {
  const capped = slugs.slice(0, MAX_RECENTS);
  safeSet(RECENT_CALCS_KEY, capped);
  return capped;
}

export function getFavoriteCalculators(): string[] {
  return safeGet<string[]>(FAVORITE_CALCS_KEY, []);
}

export function toggleFavoriteCalculator(slug: string): string[] {
  const current = getFavoriteCalculators();
  const updated = current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current];
  safeSet(FAVORITE_CALCS_KEY, updated);
  notifyChange();
  return updated;
}

export function setFavoriteCalculators(slugs: string[]) {
  safeSet(FAVORITE_CALCS_KEY, slugs);
  return slugs;
}

export function getRecentSearches(): string[] {
  return safeGet<string[]>(RECENT_SEARCHES_KEY, []);
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return getRecentSearches();
  const current = getRecentSearches().filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
  const updated = [trimmed, ...current].slice(0, MAX_RECENT_SEARCHES);
  safeSet(RECENT_SEARCHES_KEY, updated);
  return updated;
}

export function clearRecentSearches() {
  safeSet(RECENT_SEARCHES_KEY, []);
  return [];
}

export interface ScenarioEntry {
  id: string;
  label: string;
  values: Record<string, number | string | boolean>;
  timestamp: number;
}

type ScenarioStore = Record<string, ScenarioEntry[]>;

function getScenarioStore(): ScenarioStore {
  return safeGet<ScenarioStore>(SCENARIOS_KEY, {});
}

export function getScenarios(slug: string): ScenarioEntry[] {
  return getScenarioStore()[slug] ?? [];
}

export function saveScenario(slug: string, label: string, values: Record<string, number | string | boolean>): ScenarioEntry[] {
  const store = getScenarioStore();
  const entry: ScenarioEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    values,
    timestamp: Date.now(),
  };
  const updated = [entry, ...(store[slug] ?? [])].slice(0, MAX_SCENARIOS_PER_CALC);
  const nextStore: ScenarioStore = { [slug]: updated, ...store };
  const slugs = Object.keys(nextStore).slice(0, MAX_SCENARIO_CALCS);
  const trimmed: ScenarioStore = {};
  for (const s of slugs) trimmed[s] = nextStore[s];
  safeSet(SCENARIOS_KEY, trimmed);
  notifyChange();
  return updated;
}

export function removeScenario(slug: string, id: string): ScenarioEntry[] {
  const store = getScenarioStore();
  const updated = (store[slug] ?? []).filter((s) => s.id !== id);
  safeSet(SCENARIOS_KEY, { ...store, [slug]: updated });
  notifyChange();
  return updated;
}
