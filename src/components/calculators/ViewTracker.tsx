"use client";

import { useEffect } from "react";
import { addRecentCalculator } from "@/lib/storage";
import { trackCalculatorView } from "@/lib/analytics";
import { logInternalEvent } from "@/lib/admin/analyticsEvents";

export default function ViewTracker({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    addRecentCalculator(slug);
    trackCalculatorView(slug, title);
    logInternalEvent("calculator_view", { slug, title });
  }, [slug, title]);
  return null;
}
