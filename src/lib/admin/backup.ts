import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";
import { getSiteSettings, saveSiteSettings, SiteSettings } from "./siteSettings";
import { getNotFoundSettings, saveNotFoundSettings, NotFoundSettings } from "./notFoundSettings";

export interface BackupBundle {
  exportedAt: string;
  siteSettings: SiteSettings;
  notFoundSettings: NotFoundSettings;
  redirects: Record<string, unknown>[];
  media: Record<string, unknown>[];
  calculatorOverrides: Record<string, unknown>[];
  posts: Record<string, unknown>[];
}

async function dumpCollection(name: string): Promise<Record<string, unknown>[]> {
  const snap = await withTimeout(getDocs(collection(db, name)), 8000);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function exportBackup(): Promise<BackupBundle> {
  const [siteSettings, notFoundSettings, redirects, media, calculatorOverrides, posts] = await Promise.all([
    getSiteSettings(),
    getNotFoundSettings(),
    dumpCollection("redirects"),
    dumpCollection("media"),
    dumpCollection("calculator_overrides"),
    dumpCollection("posts"),
  ]);
  return { exportedAt: new Date().toISOString(), siteSettings, notFoundSettings, redirects, media, calculatorOverrides, posts };
}

async function restoreCollection(name: string, docs: Record<string, unknown>[]): Promise<void> {
  for (const d of docs) {
    const { id, ...rest } = d;
    if (!id || typeof id !== "string") continue;
    await withTimeout(setDoc(doc(db, name, id), rest, { merge: true }));
  }
}

// Restoring blog posts is intentionally excluded to avoid a stray backup file
// silently overwriting live editorial content — posts are included in the
// export for archival purposes only.
export async function restoreBackup(bundle: Partial<BackupBundle>): Promise<void> {
  if (bundle.siteSettings) await saveSiteSettings(bundle.siteSettings);
  if (bundle.notFoundSettings) await saveNotFoundSettings(bundle.notFoundSettings);
  if (bundle.redirects) await restoreCollection("redirects", bundle.redirects);
  if (bundle.media) await restoreCollection("media", bundle.media);
  if (bundle.calculatorOverrides) await restoreCollection("calculator_overrides", bundle.calculatorOverrides);
}
