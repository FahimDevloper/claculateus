import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export interface SocialLink {
  label: string;
  url: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  tagline: string;
  contactEmail: string;
  logoUrl: string;
  accentColor: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  heroHeadline: string;
  heroSubheadline: string;
  socialLinks: SocialLink[];
  customNavLinks: NavLink[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  tagline: "Free online calculators for finance, health, math and everyday life — fast, accurate, and built for the way you actually think.",
  contactEmail: "mdfahimhasan894@gmail.com",
  logoUrl: "",
  accentColor: "",
  maintenanceMode: false,
  maintenanceMessage: "Calculateus is undergoing scheduled maintenance. We'll be back shortly.",
  heroHeadline: "",
  heroSubheadline: "",
  socialLinks: [],
  customNavLinks: [],
};

const SETTINGS_REF = doc(db, "settings", "site");

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await withTimeout(getDoc(SETTINGS_REF), 4000);
    if (!snap.exists()) return DEFAULT_SITE_SETTINGS;
    return { ...DEFAULT_SITE_SETTINGS, ...(snap.data() as Partial<SiteSettings>) };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await withTimeout(setDoc(SETTINGS_REF, settings, { merge: true }));
}
