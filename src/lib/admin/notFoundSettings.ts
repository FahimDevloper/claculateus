import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export interface SuggestedLink {
  label: string;
  href: string;
}

export interface NotFoundSettings {
  heading: string;
  message: string;
  suggestedLinks: SuggestedLink[];
}

export const DEFAULT_NOT_FOUND_SETTINGS: NotFoundSettings = {
  heading: "Page not found",
  message: "The page you're looking for doesn't exist or may have moved. Try searching for a calculator instead.",
  suggestedLinks: [
    { label: "Mortgage Calculator", href: "/calculators/mortgage" },
    { label: "BMI Calculator", href: "/calculators/bmi" },
    { label: "Percentage Calculator", href: "/calculators/percentage" },
  ],
};

const REF = doc(db, "settings", "notFound");

export async function getNotFoundSettings(): Promise<NotFoundSettings> {
  try {
    const snap = await withTimeout(getDoc(REF), 4000);
    if (!snap.exists()) return DEFAULT_NOT_FOUND_SETTINGS;
    return { ...DEFAULT_NOT_FOUND_SETTINGS, ...(snap.data() as Partial<NotFoundSettings>) };
  } catch {
    return DEFAULT_NOT_FOUND_SETTINGS;
  }
}

export async function saveNotFoundSettings(settings: NotFoundSettings): Promise<void> {
  await withTimeout(setDoc(REF, settings, { merge: true }));
}
