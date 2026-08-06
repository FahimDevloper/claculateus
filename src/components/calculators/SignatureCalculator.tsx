"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import CalculatorApp from "./CalculatorApp";
import HistoryPanel from "./HistoryPanel";
import { HistoryIcon } from "@/components/icons";
import { addHistoryEntry, clearHistory, getHistory, HistoryEntry, DATA_MERGED_EVENT } from "@/lib/storage";

function PanelLoading() {
  return (
    <div className="glass mx-auto flex h-96 w-full max-w-md items-center justify-center rounded-3xl">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

// Only "basic" mode is visible on first paint (the homepage hero renders this
// component above the fold), so Finance/Convert are code-split out of the
// initial bundle and fetched on demand when a visitor actually picks that tab.
const FinancePanel = dynamic(() => import("./panels/FinancePanel"), { loading: PanelLoading });
const ConvertPanel = dynamic(() => import("./panels/ConvertPanel"), { loading: PanelLoading });

type Mode = "basic" | "scientific" | "finance" | "convert";

const TABS: { id: Mode; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "scientific", label: "Scientific" },
  { id: "finance", label: "Finance" },
  { id: "convert", label: "Convert" },
];

export default function SignatureCalculator({ initialMode = "basic", compact }: { initialMode?: Mode; compact?: boolean }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
    function onMerge() {
      setEntries(getHistory());
    }
    window.addEventListener(DATA_MERGED_EVENT, onMerge);
    return () => window.removeEventListener(DATA_MERGED_EVENT, onMerge);
  }, []);

  function logResult(expression: string, result: string) {
    const calcMode: HistoryEntry["mode"] = mode === "basic" || mode === "scientific" ? mode : mode;
    setEntries(addHistoryEntry({ mode: calcMode, expression, result }));
  }

  function handleClear() {
    setEntries(clearHistory());
  }

  return (
    <div className="w-full">
      <div className="mx-auto mb-4 flex w-full max-w-md items-center gap-2">
        <div className="scrollbar-thin flex min-w-0 flex-1 flex-nowrap gap-1 overflow-x-auto rounded-full border border-border bg-surface/80 p-1 backdrop-blur">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                mode === t.id ? "text-primary-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {mode === t.id && (
                <motion.span layoutId="signature-tab-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 500, damping: 34 }} />
              )}
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setHistoryOpen((o) => !o)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            historyOpen ? "border-primary text-primary" : "border-border text-muted hover:text-foreground"
          }`}
        >
          <HistoryIcon width={13} height={13} />
          History
        </button>
      </div>

      {mode === "basic" && <CalculatorApp initialMode="basic" onEquals={logResult} compact={compact} showModeSwitcher={false} />}
      {mode === "scientific" && <CalculatorApp initialMode="scientific" onEquals={logResult} compact={compact} showModeSwitcher={false} />}
      {mode === "finance" && <FinancePanel onResult={logResult} compact={compact} />}
      {mode === "convert" && <ConvertPanel onResult={logResult} compact={compact} />}

      <HistoryPanel entries={entries} onClear={handleClear} open={historyOpen} />
    </div>
  );
}
