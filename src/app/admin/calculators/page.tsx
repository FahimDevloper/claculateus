"use client";

import { useEffect, useMemo, useState } from "react";
import { allCalculators } from "@/lib/calculators/registry";
import { CalculatorOverride, getAllCalculatorOverrides, saveCalculatorOverride } from "@/lib/admin/calculatorOverrides";

export default function CalculatorManagerPage() {
  const [overrides, setOverrides] = useState<Record<string, CalculatorOverride> | null>(null);
  const [search, setSearch] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  useEffect(() => {
    getAllCalculatorOverrides().then(setOverrides);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allCalculators;
    return allCalculators.filter((c) => c.title.toLowerCase().includes(q) || c.slug.includes(q));
  }, [search]);

  async function toggleFeatured(slug: string, current: boolean | undefined) {
    if (!overrides) return;
    const nextFeatured = current === true ? false : true;
    const next = { ...overrides[slug], featured: nextFeatured };
    setOverrides({ ...overrides, [slug]: next });
    setSavingSlug(slug);
    try {
      await saveCalculatorOverride(slug, next);
    } finally {
      setSavingSlug(null);
    }
  }

  async function saveSeo(slug: string, seoTitle: string, seoDescription: string) {
    if (!overrides) return;
    const next = { ...overrides[slug], seoTitle, seoDescription };
    setOverrides({ ...overrides, [slug]: next });
    setSavingSlug(slug);
    try {
      await saveCalculatorOverride(slug, next);
      setEditingSlug(null);
    } finally {
      setSavingSlug(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Calculator Manager</h2>
        <p className="mt-1 text-sm text-muted">
          {allCalculators.length} calculators are defined in code, not a database — that's what lets every one of
          them load instantly with no server round-trip. From here you can feature a calculator on the homepage
          or override its SEO title/description without touching code.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search calculators…"
        className="field-input max-w-sm"
      />

      {overrides === null ? (
        <div className="flex min-h-[20vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex flex-col divide-y divide-border">
            {filtered.map((c) => {
              const o = overrides[c.slug];
              const isFeatured = o?.featured === true || (o?.featured !== false && c.popular);
              const isEditing = editingSlug === c.slug;
              return (
                <div key={c.slug} className="flex flex-col gap-3 px-5 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.title}</p>
                      <p className="text-xs text-muted">/calculators/{c.slug} · {c.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFeatured(c.slug, o?.featured)}
                        disabled={savingSlug === c.slug}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          isFeatured ? "bg-primary text-primary-foreground" : "border border-border text-muted hover:text-foreground"
                        }`}
                      >
                        {isFeatured ? "Featured" : "Feature on homepage"}
                      </button>
                      <button
                        onClick={() => setEditingSlug(isEditing ? null : c.slug)}
                        className="btn-ghost rounded-full px-3 py-1.5 text-xs font-semibold"
                      >
                        {isEditing ? "Cancel" : "Edit SEO"}
                      </button>
                    </div>
                  </div>
                  {isEditing && (
                    <SeoEditForm
                      defaultTitle={c.title}
                      defaultDescription={c.description}
                      seoTitle={o?.seoTitle ?? ""}
                      seoDescription={o?.seoDescription ?? ""}
                      saving={savingSlug === c.slug}
                      onSave={(title, desc) => saveSeo(c.slug, title, desc)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SeoEditForm({
  defaultTitle,
  defaultDescription,
  seoTitle,
  seoDescription,
  saving,
  onSave,
}: {
  defaultTitle: string;
  defaultDescription: string;
  seoTitle: string;
  seoDescription: string;
  saving: boolean;
  onSave: (title: string, description: string) => void;
}) {
  const [title, setTitle] = useState(seoTitle);
  const [description, setDescription] = useState(seoDescription);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface-2 p-4">
      <label className="flex flex-col gap-1.5 text-xs text-muted">
        SEO title override (default: &ldquo;{defaultTitle}&rdquo;)
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={defaultTitle} className="field-input" />
      </label>
      <label className="flex flex-col gap-1.5 text-xs text-muted">
        SEO description override (default: &ldquo;{defaultDescription}&rdquo;)
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder={defaultDescription} className="field-input resize-none" />
      </label>
      <button
        onClick={() => onSave(title.trim(), description.trim())}
        disabled={saving}
        className="btn-primary mt-1 w-fit rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save override"}
      </button>
    </div>
  );
}
