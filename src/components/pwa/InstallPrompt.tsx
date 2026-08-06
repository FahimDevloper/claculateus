"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, DownloadIcon } from "@/components/icons";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "calculateus:install-dismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onPrompt(e: Event) {
      e.preventDefault();
      if (localStorage.getItem(DISMISSED_KEY)) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setVisible(false);
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25 }}
          className="glass fixed bottom-4 left-4 right-4 z-40 flex items-center gap-3 rounded-2xl p-4 sm:left-auto sm:right-4 sm:w-80"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary">
            <DownloadIcon width={18} height={18} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Install Calculateus</p>
            <p className="text-xs text-muted">Quick access from your home screen, works offline.</p>
          </div>
          <button onClick={install} className="btn-primary shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold">
            Install
          </button>
          <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-muted hover:text-foreground">
            <XIcon width={14} height={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
