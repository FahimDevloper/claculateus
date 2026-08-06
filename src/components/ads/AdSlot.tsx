"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  enabled: boolean;
  publisherId: string;
  slotId: string;
  className?: string;
}

/**
 * Reserves a fixed-height box for a manual AdSense unit so the async ad
 * iframe doesn't shift surrounding content once it loads (CLS). Renders
 * nothing until the admin's master "Enable ad slots" switch is on and both
 * a publisher ID and this placement's slot ID are set in /admin/integrations
 * — so there's no dead space while AdSense approval is pending.
 */
export default function AdSlot({ enabled, publisherId, slotId, className = "" }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || !publisherId || !slotId || pushed.current) return;
    pushed.current = true;
    try {
      const ads = window.adsbygoogle || [];
      ads.push({});
      window.adsbygoogle = ads;
    } catch {
      // ad blockers or a slow/blocked script shouldn't break the page
    }
  }, [enabled, publisherId, slotId]);

  if (!enabled || !publisherId || !slotId) return null;

  return (
    <div className={`flex min-h-[280px] w-full flex-col items-center justify-center gap-1.5 ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Advertisement</span>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: 250 }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
