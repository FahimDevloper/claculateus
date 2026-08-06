"use client";

import { useEffect, useState } from "react";
import { MediaItem, getMediaItems } from "@/lib/admin/media";
import { XIcon } from "@/components/icons";

interface Props {
  onSelect: (item: MediaItem) => void;
  onClose: () => void;
}

export default function ImagePicker({ onSelect, onClose }: Props) {
  const [items, setItems] = useState<MediaItem[] | null>(null);

  useEffect(() => {
    getMediaItems().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="glass flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Choose an image</h3>
            <p className="text-xs text-muted">Click to insert, or drag a thumbnail into the editor.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-foreground">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="scrollbar-thin overflow-y-auto p-4">
          {items === null ? (
            <div className="flex min-h-[20vh] items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted">
              No images in your Media Library yet. Add one from{" "}
              <a href="/admin/media" target="_blank" rel="noreferrer" className="text-primary underline">
                Media Library
              </a>{" "}
              first.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", `![${item.alt}](${item.url})`)}
                  onClick={() => onSelect(item)}
                  className="group overflow-hidden rounded-lg border border-border text-left transition hover:border-primary"
                  title={item.alt || item.url}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="h-20 w-full bg-surface-2 object-cover transition group-hover:opacity-80"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
