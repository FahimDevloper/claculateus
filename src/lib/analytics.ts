import { logEvent } from "firebase/analytics";
import { getAnalyticsInstance } from "@/lib/firebase/app";

export async function trackPageView(path: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, "page_view", { page_path: path });
}

export async function trackCalculatorView(slug: string, title: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, "calculator_view", { calculator_slug: slug, calculator_title: title });
}

export async function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, name, params);
}
