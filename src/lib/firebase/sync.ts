import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./app";
import {
  HistoryEntry,
  getHistory,
  setHistory,
  getFavoriteCalculators,
  setFavoriteCalculators,
  getRecentCalculators,
  setRecentCalculators,
} from "@/lib/storage";

interface CloudSnapshot {
  favorites?: string[];
  recentCalculators?: string[];
  calcHistory?: HistoryEntry[];
  updatedAt?: unknown;
}

function mergeUnique(a: string[], b: string[], max: number): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const s of [...a, ...b]) {
    if (!seen.has(s)) {
      seen.add(s);
      merged.push(s);
    }
  }
  return merged.slice(0, max);
}

function mergeHistory(a: HistoryEntry[], b: HistoryEntry[], max: number): HistoryEntry[] {
  const byId = new Map<string, HistoryEntry>();
  for (const e of [...a, ...b]) byId.set(e.id, e);
  return [...byId.values()].sort((x, y) => y.timestamp - x.timestamp).slice(0, max);
}

/** Called once when a user signs in: merges local (anonymous) data with their cloud data. */
export async function pullAndMergeFromCloud(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  const cloud: CloudSnapshot = snap.exists() ? snap.data() : {};

  const mergedFavorites = mergeUnique(getFavoriteCalculators(), cloud.favorites ?? [], 200);
  const mergedRecents = mergeUnique(getRecentCalculators(), cloud.recentCalculators ?? [], 12);
  const mergedHistory = mergeHistory(getHistory(), cloud.calcHistory ?? [], 50);

  setFavoriteCalculators(mergedFavorites);
  setRecentCalculators(mergedRecents);
  setHistory(mergedHistory);

  await setDoc(
    ref,
    {
      favorites: mergedFavorites,
      recentCalculators: mergedRecents,
      calcHistory: mergedHistory,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/** Pushes the current local snapshot to Firestore for a signed-in user. */
export async function pushSnapshotToCloud(uid: string) {
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    {
      favorites: getFavoriteCalculators(),
      recentCalculators: getRecentCalculators(),
      calcHistory: getHistory(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
