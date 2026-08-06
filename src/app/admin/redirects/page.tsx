"use client";

import { useEffect, useState } from "react";
import { RedirectRule, addRedirect, deleteRedirect, getRedirects } from "@/lib/admin/redirects";

export default function RedirectsPage() {
  const [rules, setRules] = useState<RedirectRule[] | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [permanent, setPermanent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    getRedirects().then(setRules).catch(() => setRules([]));
  }

  useEffect(refresh, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanFrom = from.trim();
    const cleanTo = to.trim();
    if (!cleanFrom.startsWith("/") || !cleanTo) {
      setError("\"From\" must start with / and \"To\" is required.");
      return;
    }
    setSaving(true);
    try {
      await addRedirect(cleanFrom, cleanTo, permanent);
      setFrom("");
      setTo("");
      refresh();
    } catch {
      setError("Couldn't save that redirect — please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteRedirect(id);
    refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Redirects</h2>
        <p className="mt-1 text-sm text-muted">
          Send an old URL to a new one. Enforced site-wide in middleware, checked before every page renders.
        </p>
      </div>

      <form onSubmit={handleAdd} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5 text-xs text-muted">
          From (path)
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="/old-calculator" className="field-input" />
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-xs text-muted">
          To (path or URL)
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="/calculators/new-slug" className="field-input" />
        </label>
        <label className="flex items-center gap-2 whitespace-nowrap pb-2 text-xs text-muted">
          <input type="checkbox" checked={permanent} onChange={(e) => setPermanent(e.target.checked)} className="h-4 w-4" />
          Permanent (301)
        </label>
        <button type="submit" disabled={saving} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
          {saving ? "Saving…" : "Add redirect"}
        </button>
      </form>
      {error && <p className="text-sm text-danger">{error}</p>}

      {rules === null ? (
        <div className="flex min-h-[20vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : rules.length === 0 ? (
        <p className="text-sm text-muted">No redirects yet.</p>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex flex-col divide-y divide-border">
            {rules.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-foreground">{r.from}</span>
                  <span className="text-muted">→</span>
                  <span className="font-mono text-muted">{r.to}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted">
                    {r.permanent ? "301" : "302"}
                  </span>
                </div>
                <button onClick={() => handleDelete(r.id)} className="text-xs font-semibold text-danger hover:underline">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
