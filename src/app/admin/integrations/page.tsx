"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  DEFAULT_INTEGRATIONS_SETTINGS,
  IntegrationsSettings,
  getIntegrationsSettings,
  saveIntegrationsSettings,
} from "@/lib/admin/integrations";
import { CheckCircleIcon, GoogleIcon } from "@/components/icons";

function ConnectedBadge({ connected }: { connected: boolean }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
        <CheckCircleIcon className="h-3.5 w-3.5" />
        Connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-muted">
      Not connected
    </span>
  );
}

function ServiceCard({
  icon,
  title,
  description,
  connected,
  getUrl,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  connected: boolean;
  getUrl: string;
  children: ReactNode;
}) {
  return (
    <section className="card flex flex-col gap-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2">{icon}</div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <p className="mt-0.5 text-xs text-muted">{description}</p>
          </div>
        </div>
        <ConnectedBadge connected={connected} />
      </div>
      {children}
      <a href={getUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">
        Get this from {new URL(getUrl).hostname} ↗
      </a>
    </section>
  );
}

export default function IntegrationsPage() {
  const [settings, setSettings] = useState<IntegrationsSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getIntegrationsSettings().then(setSettings);
  }, []);

  function update<K extends keyof IntegrationsSettings>(key: K, value: IntegrationsSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setStatus(null);
    try {
      await saveIntegrationsSettings(settings);
      setStatus("Saved — live on the site now.");
    } catch {
      setStatus("Couldn't save — please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 4000);
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
        <div>
          <h2 className="text-xl font-bold text-foreground">Integrations</h2>
          <p className="mt-1 text-sm text-muted">
            Connect Search Console, Analytics, AdSense and more — paste in an ID or verification code below and it's
            live sitewide immediately, no code changes needed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="text-sm text-muted">{status}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <ServiceCard
        icon={<GoogleIcon />}
        title="Google Search Console"
        description="Verify site ownership so you can submit your sitemap and monitor indexing."
        connected={!!settings.gscVerification}
        getUrl="https://search.google.com/search-console"
      >
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Verification meta tag content
          <input
            value={settings.gscVerification}
            onChange={(e) => update("gscVerification", e.target.value)}
            placeholder="e.g. abc123XYZ (the content= value from the HTML tag method)"
            className="field-input font-mono"
          />
        </label>
      </ServiceCard>

      <ServiceCard
        icon={<GoogleIcon />}
        title="Google Analytics"
        description="Track visitors and traffic with GA4. Adds the tracking snippet to every page automatically."
        connected={!!settings.gaMeasurementId}
        getUrl="https://analytics.google.com"
      >
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Measurement ID
          <input
            value={settings.gaMeasurementId}
            onChange={(e) => update("gaMeasurementId", e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="field-input font-mono"
          />
        </label>
      </ServiceCard>

      <ServiceCard
        icon={<GoogleIcon />}
        title="Google AdSense"
        description="Adds the AdSense verification script sitewide and generates ads.txt — required before you can apply for approval."
        connected={!!settings.adsensePublisherId}
        getUrl="https://www.google.com/adsense"
      >
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Publisher ID
          <input
            value={settings.adsensePublisherId}
            onChange={(e) => update("adsensePublisherId", e.target.value)}
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
            className="field-input font-mono"
          />
        </label>
        {settings.adsensePublisherId && (
          <p className="text-xs text-muted">
            Auto ads are controlled from your AdSense account itself (Ads → Overview → Auto ads) — no separate
            toggle needed here once the Publisher ID above is set.
          </p>
        )}
        {settings.adsensePublisherId && (
          <p className="text-xs text-muted">
            ads.txt is now live at{" "}
            <a href="/ads.txt" target="_blank" className="text-primary hover:underline">
              /ads.txt
            </a>{" "}
            — AdSense checks this automatically.
          </p>
        )}

        <div className="mt-2 flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Ad slot placements</p>
              <p className="mt-0.5 text-xs text-muted">
                Reserved-space ad units on calculator and blog pages. Keep this off while your AdSense application is
                pending — nothing renders (and no space is reserved) until you switch it on.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.adSlotsEnabled}
              onClick={() => update("adSlotsEnabled", !settings.adSlotsEnabled)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                settings.adSlotsEnabled ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  settings.adSlotsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <label className="flex flex-col gap-1.5 text-xs text-muted">
            Below calculator tool — ad slot ID
            <input
              value={settings.adSlotCalculatorBottom}
              onChange={(e) => update("adSlotCalculatorBottom", e.target.value)}
              placeholder="e.g. 1234567890"
              className="field-input font-mono"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-muted">
            In calculator article — ad slot ID
            <input
              value={settings.adSlotCalculatorArticle}
              onChange={(e) => update("adSlotCalculatorArticle", e.target.value)}
              placeholder="e.g. 1234567890"
              className="field-input font-mono"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-muted">
            In blog article — ad slot ID
            <input
              value={settings.adSlotBlogArticle}
              onChange={(e) => update("adSlotBlogArticle", e.target.value)}
              placeholder="e.g. 1234567890"
              className="field-input font-mono"
            />
          </label>
          <p className="text-xs text-muted">
            Create each ad unit in AdSense under Ads → By ad unit → Display ads, then paste its slot ID here. Leave a
            field blank to skip that placement.
          </p>
        </div>
      </ServiceCard>

      <ServiceCard
        icon={<GoogleIcon />}
        title="Google Ads"
        description="Adds conversion tracking so you can measure results from Google Ads campaigns. Separate from AdSense."
        connected={!!settings.googleAdsConversionId}
        getUrl="https://ads.google.com"
      >
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Conversion ID
          <input
            value={settings.googleAdsConversionId}
            onChange={(e) => update("googleAdsConversionId", e.target.value)}
            placeholder="AW-XXXXXXXXX"
            className="field-input font-mono"
          />
        </label>
      </ServiceCard>

      <ServiceCard
        icon={<GoogleIcon />}
        title="Google Tag Manager"
        description="Manage all your tracking tags in one place without further code changes."
        connected={!!settings.gtmContainerId}
        getUrl="https://tagmanager.google.com"
      >
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Container ID
          <input
            value={settings.gtmContainerId}
            onChange={(e) => update("gtmContainerId", e.target.value)}
            placeholder="GTM-XXXXXXX"
            className="field-input font-mono"
          />
        </label>
      </ServiceCard>

      <ServiceCard
        icon={<span className="text-base">🅱️</span>}
        title="Bing Webmaster Tools"
        description="Verify ownership so Bing can index your site and you can monitor search performance there too."
        connected={!!settings.bingVerification}
        getUrl="https://www.bing.com/webmasters"
      >
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Verification meta tag content
          <input
            value={settings.bingVerification}
            onChange={(e) => update("bingVerification", e.target.value)}
            placeholder="the content= value from the HTML meta tag method"
            className="field-input font-mono"
          />
        </label>
      </ServiceCard>

      <ServiceCard
        icon={<span className="text-base">📌</span>}
        title="Pinterest"
        description="Verify your site for Pinterest's rich pins and analytics."
        connected={!!settings.pinterestVerification}
        getUrl="https://www.pinterest.com/business/hub"
      >
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Verification meta tag content
          <input
            value={settings.pinterestVerification}
            onChange={(e) => update("pinterestVerification", e.target.value)}
            placeholder="the content= value from the HTML meta tag method"
            className="field-input font-mono"
          />
        </label>
      </ServiceCard>

      <p className="text-xs text-muted">
        This connects verification and tracking — the lightweight version of what a plugin like Site Kit does. It
        doesn't pull live reports into this dashboard (that needs a Google Cloud OAuth app only you can create) —
        for now, check performance directly in each service's own dashboard using the links above.
      </p>
    </div>
  );
}
