"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HistoryEntry } from "@/lib/storage";
import { DownloadIcon } from "@/components/icons";

function exportCsv(entries: HistoryEntry[]) {
  const rows = [["Mode", "Expression", "Result", "Date"], ...entries.map((e) => [e.mode, e.expression, e.result, new Date(e.timestamp).toISOString()])];
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "calculateus-history.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function HistoryPanel({ entries, onClear, open }: { entries: HistoryEntry[]; onClear: () => void; open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="mx-auto w-full max-w-md overflow-hidden"
        >
          <div className="glass mt-3 rounded-2xl">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
              <span className="text-xs font-semibold text-muted">History</span>
              <div className="flex items-center gap-3">
                {entries.length > 0 && (
                  <button onClick={() => exportCsv(entries)} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <DownloadIcon width={13} height={13} /> CSV
                  </button>
                )}
                <button onClick={onClear} className="text-xs font-medium text-muted hover:text-danger">Clear</button>
              </div>
            </div>
            <div className="scrollbar-thin max-h-56 overflow-y-auto p-2">
              {entries.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs text-muted">No calculations yet — your history will appear here.</p>
              ) : (
                entries.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-surface-2">
                    <span className="truncate text-muted">{e.expression}</span>
                    <span className="ml-3 shrink-0 font-semibold text-foreground">{e.result}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
