"use client";

import { useEffect, useState } from "react";
import {
  NotFoundSettings,
  SuggestedLink,
  getNotFoundSettings,
  saveNotFoundSettings,
} from "@/lib/admin/notFoundSettings";

export default function NotFoundAdminPage() {
  const [settings, setSettings] = useState<NotFoundSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getNotFoundSettings().then(setSettings);
  }, []);

  function updateLink(i: number, patch: Partial<SuggestedLink>) {
    setSettings((s) => (s ? { ...s, suggestedLinks: s.suggestedLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) } : s));
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setStatus(null);
    try {
      await saveNotFoundSettings(settings);
      setStatus("Saved.");
    } catch {
      setStatus("Couldn't save — please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  if (!settings) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">404 Page</h2>
        <div className="flex items-center gap-3">
          {status && <span className="text-sm text-muted">{status}</span>}
          <button onClick={handleSave} disabled={saving} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <section className="card flex flex-col gap-4 p-6">
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Heading
          <input value={settings.heading} onChange={(e) => setSettings({ ...settings, heading: e.target.value })} className="field-input" />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Message
          <textarea value={settings.message} onChange={(e) => setSettings({ ...settings, message: e.target.value })} rows={3} className="field-input resize-none" />
        </label>
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Suggested links</h3>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, suggestedLinks: [...settings.suggestedLinks, { label: "", href: "" }] })}
            className="btn-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            + Add link
          </button>
        </div>
        {settings.suggestedLinks.map((link, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
            <input value={link.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Label" className="field-input" />
            <input value={link.href} onChange={(e) => updateLink(i, { href: e.target.value })} placeholder="/calculators/…" className="field-input" />
            <button
              type="button"
              onClick={() => setSettings({ ...settings, suggestedLinks: settings.suggestedLinks.filter((_, idx) => idx !== i) })}
              className="text-xs font-semibold text-danger hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
