import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export interface MediaItem {
  id: string;
  url: string;
  alt: string;
  addedAt: number | null;
}

const COL = collection(db, "media");

export async function getMediaItems(): Promise<MediaItem[]> {
  const snap = await withTimeout(getDocs(query(COL, orderBy("addedAt", "desc"))), 4000);
  return snap.docs.map((d) => {
    const data = d.data() as { url: string; alt: string; addedAt?: { toMillis(): number } };
    return { id: d.id, url: data.url, alt: data.alt, addedAt: data.addedAt?.toMillis() ?? null };
  });
}

export async function addMediaItem(url: string, alt: string): Promise<void> {
  await withTimeout(addDoc(COL, { url, alt, addedAt: serverTimestamp() }));
}

export async function deleteMediaItem(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, "media", id)));
}
