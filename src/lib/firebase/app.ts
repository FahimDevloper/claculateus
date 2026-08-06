import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { isSupported, getAnalytics, type Analytics } from "firebase/analytics";
import { firebaseConfig } from "./config";

export const firebaseApp: FirebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);

let analyticsInstance: Analytics | null = null;

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;
  if (await isSupported()) {
    analyticsInstance = getAnalytics(firebaseApp);
  }
  return analyticsInstance;
}
