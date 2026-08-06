import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export interface IntegrationsSettings {
  gaMeasurementId: string;
  gscVerification: string;
  adsensePublisherId: string;
  adsenseAutoAds: boolean;
  gtmContainerId: string;
  bingVerification: string;
  pinterestVerification: string;
  googleAdsConversionId: string;
  /** Master switch for manual ad-slot placements below. Off by default so
   *  nothing renders while AdSense approval is pending. */
  adSlotsEnabled: boolean;
  adSlotCalculatorBottom: string;
  adSlotCalculatorArticle: string;
  adSlotBlogArticle: string;
}

export const DEFAULT_INTEGRATIONS_SETTINGS: IntegrationsSettings = {
  gaMeasurementId: "",
  gscVerification: "",
  adsensePublisherId: "",
  adsenseAutoAds: true,
  gtmContainerId: "",
  bingVerification: "",
  pinterestVerification: "",
  googleAdsConversionId: "",
  adSlotsEnabled: false,
  adSlotCalculatorBottom: "",
  adSlotCalculatorArticle: "",
  adSlotBlogArticle: "",
};

const INTEGRATIONS_REF = doc(db, "settings", "integrations");

export async function getIntegrationsSettings(): Promise<IntegrationsSettings> {
  try {
    const snap = await withTimeout(getDoc(INTEGRATIONS_REF), 4000);
    if (!snap.exists()) return DEFAULT_INTEGRATIONS_SETTINGS;
    return { ...DEFAULT_INTEGRATIONS_SETTINGS, ...(snap.data() as Partial<IntegrationsSettings>) };
  } catch {
    return DEFAULT_INTEGRATIONS_SETTINGS;
  }
}

export async function saveIntegrationsSettings(settings: IntegrationsSettings): Promise<void> {
  await withTimeout(setDoc(INTEGRATIONS_REF, settings, { merge: true }));
}
