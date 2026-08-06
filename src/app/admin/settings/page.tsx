"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SITE_SETTINGS,
  NavLink,
  SiteSettings,
  SocialLink,
  getSiteSettings,
  saveSiteSettings,
} from "@/lib/admin/siteSettings";

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  function updateSocial(i: number, patch: Partial<SocialLink>) {
    setSettings((s) => {
      if (!s) return s;
      const socialLinks = s.socialLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
      return { ...s, socialLinks };
    });
  }

  function updateNav(i: number, patch: Partial<NavLink>) {
    setSettings((s) => {
      if (!s) return s;
      const customNavLinks = s.customNavLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
      return { ...s, customNavLinks };
    });
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setStatus(null);
    try {
      await saveSiteSettings(settings);
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
        <h2 className="text-xl font-bold text-foreground">Site Settings</h2>
        <div className="flex items-center gap-3">
          {status && <span className="text-sm text-muted">{status}</span>}
          <button onClick={handleSave} disabled={saving} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <section className="card flex flex-col gap-4 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Branding</h3>
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Tagline (shown in the footer)
          <textarea value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} rows={2} className="field-input resize-none" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs text-muted">
            Logo URL (leave blank to use the default wordmark)
            <input value={settings.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} placeholder="https://…" className="field-input" />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-muted">
            Accent color (hex, leave blank for default)
            <input value={settings.accentColor} onChange={(e) => update("accentColor", e.target.value)} placeholder="#6d5ef8" className="field-input" />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Contact email
          <input value={settings.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className="field-input" />
        </label>
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Homepage hero</h3>
        <p className="text-xs text-muted">Leave blank to keep the default hero copy.</p>
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Headline override
          <input value={settings.heroHeadline} onChange={(e) => update("heroHeadline", e.target.value)} className="field-input" />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Subheadline override
          <textarea value={settings.heroSubheadline} onChange={(e) => update("heroSubheadline", e.target.value)} rows={2} className="field-input resize-none" />
        </label>
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Social links</h3>
          <button
            type="button"
            onClick={() => update("socialLinks", [...settings.socialLinks, { label: "", url: "" }])}
            className="btn-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            + Add link
          </button>
        </div>
        {settings.socialLinks.length === 0 && <p className="text-xs text-muted">No social links yet.</p>}
        {settings.socialLinks.map((link, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
            <input value={link.label} onChange={(e) => updateSocial(i, { label: e.target.value })} placeholder="Label (e.g. X)" className="field-input" />
            <input value={link.url} onChange={(e) => updateSocial(i, { url: e.target.value })} placeholder="https://…" className="field-input" />
            <button
              type="button"
              onClick={() => update("socialLinks", settings.socialLinks.filter((_, idx) => idx !== i))}
              className="text-xs font-semibold text-danger hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Custom nav links</h3>
          <button
            type="button"
            onClick={() => update("customNavLinks", [...settings.customNavLinks, { label: "", href: "" }])}
            className="btn-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            + Add link
          </button>
        </div>
        <p className="text-xs text-muted">Extra links appended to the header, after the built-in category menu.</p>
        {settings.customNavLinks.length === 0 && <p className="text-xs text-muted">No custom nav links yet.</p>}
        {settings.customNavLinks.map((link, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
            <input value={link.label} onChange={(e) => updateNav(i, { label: e.target.value })} placeholder="Label" className="field-input" />
            <input value={link.href} onChange={(e) => updateNav(i, { href: e.target.value })} placeholder="/path or https://…" className="field-input" />
            <button
              type="button"
              onClick={() => update("customNavLinks", settings.customNavLinks.filter((_, idx) => idx !== i))}
              className="text-xs font-semibold text-danger hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Maintenance mode</h3>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => update("maintenanceMode", e.target.checked)} className="h-4 w-4" />
          Show a maintenance banner site-wide
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Maintenance message
          <textarea value={settings.maintenanceMessage} onChange={(e) => update("maintenanceMessage", e.target.value)} rows={2} className="field-input resize-none" />
        </label>
      </section>

      <p className="text-xs text-muted">
        Reverting to the defaults referenced here — {DEFAULT_SITE_SETTINGS.contactEmail} — happens automatically if Firestore is
        unreachable, so the live site never breaks because of this page.
      </p>
    </div>
  );
}
