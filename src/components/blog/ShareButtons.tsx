"use client";

import { useState } from "react";
import { ShareIcon, CopyIcon } from "@/components/icons";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // cancelled
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function print() {
    window.print();
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={share} className="btn-ghost flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
        <ShareIcon width={13} height={13} />
        {copied ? "Link copied!" : "Share"}
      </button>
      <button onClick={print} className="btn-ghost flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
        <CopyIcon width={13} height={13} />
        Print
      </button>
    </div>
  );
}
