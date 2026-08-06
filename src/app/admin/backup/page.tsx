"use client";

import { useRef, useState } from "react";
import { BackupBundle, exportBackup, restoreBackup } from "@/lib/admin/backup";
import { downloadText } from "@/lib/exportUtils";

export default function BackupPage() {
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const bundle = await exportBackup();
      const filename = `calculateus-backup-${new Date().toISOString().slice(0, 10)}.json`;
      downloadText(filename, JSON.stringify(bundle, null, 2), "application/json");
      setStatus("Backup downloaded.");
    } catch {
      setError("Couldn't export a backup — please try again.");
    } finally {
      setExporting(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  async function handleRestoreFile(file: File) {
    setRestoring(true);
    setError(null);
    setStatus(null);
    try {
      const text = await file.text();
      const bundle = JSON.parse(text) as Partial<BackupBundle>;
      await restoreBackup(bundle);
      setStatus("Restore complete.");
    } catch {
      setError("Couldn't restore from that file — check it's a Calculateus backup JSON export.");
    } finally {
      setRestoring(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Backup &amp; Restore</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Export a JSON snapshot of site settings, the 404 page, redirects, the media library, calculator
          overrides, and blog posts. Restoring re-applies everything from a snapshot except blog posts — those
          are included for archival only, so a stray restore can never silently overwrite live editorial content.
        </p>
      </div>

      <section className="card flex flex-col gap-3 p-6">
        <h3 className="text-sm font-bold text-foreground">Export</h3>
        <p className="text-sm text-muted">Downloads a single JSON file with everything listed above.</p>
        <button onClick={handleExport} disabled={exporting} className="btn-primary w-fit rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
          {exporting ? "Exporting…" : "Download backup"}
        </button>
      </section>

      <section className="card flex flex-col gap-3 p-6">
        <h3 className="text-sm font-bold text-foreground">Restore</h3>
        <p className="text-sm text-muted">Upload a previously exported backup file. Existing data with matching IDs will be overwritten.</p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          onChange={(e) => e.target.files?.[0] && handleRestoreFile(e.target.files[0])}
          disabled={restoring}
          className="text-sm text-muted"
        />
      </section>

      {status && <p className="text-sm text-foreground">{status}</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
