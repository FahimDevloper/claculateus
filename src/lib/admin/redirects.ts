import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export interface RedirectRule {
  id: string;
  from: string;
  to: string;
  permanent: boolean;
}

const COL = collection(db, "redirects");

export async function getRedirects(): Promise<RedirectRule[]> {
  const snap = await withTimeout(getDocs(COL), 4000);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<RedirectRule, "id">) }));
}

export async function addRedirect(from: string, to: string, permanent: boolean): Promise<void> {
  const id = from.replace(/^\/+/, "").replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 120) || crypto.randomUUID();
  await withTimeout(setDoc(doc(db, "redirects", id), { from, to, permanent }));
}

export async function deleteRedirect(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, "redirects", id)));
}
