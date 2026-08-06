"use client";

import { useEffect, useState } from "react";
import {
  AI_PROVIDER_LABELS,
  AiProvider,
  AiSettings,
  getAiSettings,
  saveAiSettings,
} from "@/lib/admin/aiSettings";
import { generateWithAi } from "@/lib/admin/aiGenerate";

const PROVIDERS: AiProvider[] = ["openai", "anthropic", "gemini"];

type KeyField = "openaiKey" | "anthropicKey" | "geminiKey";
type ModelField = "openaiModel" | "anthropicModel" | "geminiModel";

const KEY_FIELD: Record<AiProvider, KeyField> = {
  openai: "openaiKey",
  anthropic: "anthropicKey",
  gemini: "geminiKey",
};

const MODEL_FIELD: Record<AiProvider, ModelField> = {
  openai: "openaiModel",
  anthropic: "anthropicModel",
  gemini: "geminiModel",
};

export default function AiSettingsPage() {
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [reveal, setReveal] = useState<Record<AiProvider, boolean>>({ openai: false, anthropic: false, gemini: false });

  const [testProvider, setTestProvider] = useState<AiProvider>("openai");
  const [testPrompt, setTestPrompt] = useState("Say hello in one short sentence.");
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    getAiSettings().then((s) => {
      setSettings(s);
      setTestProvider(s.defaultProvider);
    });
  }, []);

  function update<K extends keyof AiSettings>(key: K, value: AiSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  function updateKey(field: KeyField, value: string) {
    setSettings((s) => (s ? { ...s, [field]: value } : s));
  }

  function updateModel(field: ModelField, value: string) {
    setSettings((s) => (s ? { ...s, [field]: value } : s));
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setStatus(null);
    try {
      await saveAiSettings(settings);
      setStatus("Saved.");
    } catch {
      setStatus("Couldn't save — please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  async function handleTest() {
    if (!settings) return;
    setTesting(true);
    setTestOutput(null);
    setTestError(null);
    try {
      const out = await generateWithAi(
        settings,
        testProvider,
        "You are a helpful assistant. Keep replies brief.",
        testPrompt
      );
      setTestOutput(out);
    } catch (e) {
      setTestError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setTesting(false);
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
          <h2 className="text-xl font-bold text-foreground">AI Settings</h2>
          <p className="mt-1 text-sm text-muted">
            Bring your own API keys for OpenAI, Anthropic (Claude), or Google (Gemini) to enable AI-assisted
            article writing in the blog editor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="text-sm text-muted">{status}</span>}
          <button onClick={handleSave} disabled={saving} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <section className="card flex flex-col gap-3 p-6 text-sm text-muted">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted">How this works</h3>
        <p>
          Calculateus doesn&apos;t run its own AI backend or proxy server, so requests go directly from your
          browser to the provider you choose, using the key you enter below. You&apos;re billed directly by
          that provider for anything you generate — Calculateus never sees usage or charges. Keys are stored
          in Firestore, readable only by the admin account.
        </p>
      </section>

      <section className="card flex flex-col gap-5 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted">API Keys</h3>
        {PROVIDERS.map((p) => {
          const field = KEY_FIELD[p];
          const modelField = MODEL_FIELD[p];
          return (
            <div key={p} className="flex flex-col gap-2 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
              <label className="flex flex-col gap-1.5 text-xs text-muted">
                {AI_PROVIDER_LABELS[p]} API key
                <div className="flex gap-2">
                  <input
                    type={reveal[p] ? "text" : "password"}
                    value={settings[field]}
                    onChange={(e) => updateKey(field, e.target.value)}
                    placeholder="sk-…"
                    autoComplete="off"
                    className="field-input font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setReveal((r) => ({ ...r, [p]: !r[p] }))}
                    className="btn-ghost shrink-0 rounded-lg px-3 text-xs font-semibold"
                  >
                    {reveal[p] ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <label className="flex flex-col gap-1.5 text-xs text-muted">
                Model{" "}
                <span className="text-[10px] normal-case text-muted/70">
                  (change this if you see a &quot;model not found&quot; error — providers retire model names over time)
                </span>
                <input
                  value={settings[modelField]}
                  onChange={(e) => updateModel(modelField, e.target.value)}
                  className="field-input max-w-xs font-mono"
                />
              </label>
            </div>
          );
        })}
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Default provider (used by &quot;Generate with AI&quot; in the blog editor)
          <select
            value={settings.defaultProvider}
            onChange={(e) => update("defaultProvider", e.target.value as AiProvider)}
            className="field-input max-w-xs"
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>{AI_PROVIDER_LABELS[p]}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Test a key</h3>
        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setTestProvider(p)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                testProvider === p ? "bg-primary text-primary-foreground" : "border border-border text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {AI_PROVIDER_LABELS[p]}
            </button>
          ))}
        </div>
        <textarea
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          rows={2}
          className="field-input resize-none"
        />
        <div>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {testing ? "Testing…" : "Send test prompt"}
          </button>
        </div>
        {testError && <p className="text-sm text-danger">{testError}</p>}
        {testOutput && (
          <div className="rounded-xl border border-border bg-surface-2 p-4 text-sm text-foreground">{testOutput}</div>
        )}
      </section>
    </div>
  );
}
