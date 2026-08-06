import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export interface CalculatorOverride {
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

const COL = collection(db, "calculator_overrides");

export async function getCalculatorOverride(slug: string): Promise<CalculatorOverride | null> {
  try {
    const snap = await withTimeout(getDoc(doc(db, "calculator_overrides", slug)), 2500);
    return snap.exists() ? (snap.data() as CalculatorOverride) : null;
  } catch {
    return null;
  }
}

export async function getAllCalculatorOverrides(): Promise<Record<string, CalculatorOverride>> {
  try {
    const snap = await withTimeout(getDocs(COL), 4000);
    const out: Record<string, CalculatorOverride> = {};
    snap.docs.forEach((d) => {
      out[d.id] = d.data() as CalculatorOverride;
    });
    return out;
  } catch {
    return {};
  }
}

export async function saveCalculatorOverride(slug: string, override: CalculatorOverride): Promise<void> {
  await withTimeout(setDoc(doc(db, "calculator_overrides", slug), override, { merge: true }));
}
