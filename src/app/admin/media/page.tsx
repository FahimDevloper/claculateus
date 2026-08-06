"use client";

import { useEffect, useState } from "react";
import { MediaItem, addMediaItem, deleteMediaItem, getMediaItems } from "@/lib/admin/media";

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function refresh() {
    getMediaItems().then(setItems).catch(() => setItems([]));
  }

  useEffect(refresh, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!url.trim()) {
      setError("Paste an image URL first.");
      return;
    }
    setAdding(true);
    try {
      await addMediaItem(url.trim(), alt.trim());
      setUrl("");
      setAlt("");
      refresh();
    } catch {
      setError("Couldn't add that image — please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteMediaItem(id);
    refresh();
  }

  function copyUrl(u: string) {
    navigator.clipboard.writeText(u).then(() => {
      setCopied(u);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Media Library</h2>
        <p className="mt-1 text-sm text-muted">
          Calculateus doesn't run its own file storage, so this is a URL-based library — paste a link to an
          image you've already hosted (e.g. on Unsplash, imgur, or your own CDN) and reuse it across blog
          posts and pages.
        </p>
      </div>

      <form onSubmit={handleAdd} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5 text-xs text-muted">
          Image URL
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="field-input" />
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-xs text-muted">
          Alt text
          <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describes the image" className="field-input" />
        </label>
        <button type="submit" disabled={adding} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
          {adding ? "Adding…" : "Add to library"}
        </button>
      </form>
      {error && <p className="text-sm text-danger">{error}</p>}

      {items === null ? (
        <div className="flex min-h-[20vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">No images yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt} loading="lazy" className="h-32 w-full bg-surface-2 object-cover" />
              <div className="flex flex-col gap-2 p-3">
                <p className="truncate text-xs text-muted" title={item.url}>{item.url}</p>
                {item.alt && <p className="truncate text-xs text-foreground">{item.alt}</p>}
                <div className="flex gap-2">
                  <button onClick={() => copyUrl(item.url)} className="btn-ghost flex-1 rounded-lg py-1.5 text-xs font-semibold">
                    {copied === item.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-danger hover:bg-surface-2">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
