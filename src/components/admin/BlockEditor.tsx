"use client";

import { useRef, useState } from "react";
import { Block, BlockType, BLOCK_LABELS, emptyBlock } from "@/lib/blog/blocks";
import { PlusIcon, TrashIcon, ImageIcon, BoldIcon, ItalicIcon, LinkIcon2 } from "@/components/icons";
import ImagePicker from "./ImagePicker";
import { MediaItem } from "@/lib/admin/media";

type TextEl = HTMLTextAreaElement | HTMLInputElement;

function TextToolbar({ elRef, onChange }: { elRef: React.RefObject<TextEl | null>; onChange: (text: string) => void }) {
  function wrap(before: string, after: string = before) {
    const el = elRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const start = selectionStart ?? value.length;
    const end = selectionEnd ?? value.length;
    const selected = value.slice(start, end) || "text";
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  }
  return (
    <div className="mb-1 flex gap-0.5 opacity-0 transition group-hover/block:opacity-100 focus-within:opacity-100">
      <button type="button" onClick={() => wrap("**")} title="Bold" aria-label="Bold" className="rounded p-1 text-muted hover:bg-surface-2 hover:text-foreground">
        <BoldIcon className="h-3 w-3" />
      </button>
      <button type="button" onClick={() => wrap("*")} title="Italic" aria-label="Italic" className="rounded p-1 text-muted hover:bg-surface-2 hover:text-foreground">
        <ItalicIcon className="h-3 w-3" />
      </button>
      <button type="button" onClick={() => wrap("[", "](https://)")} title="Link" aria-label="Insert link" className="rounded p-1 text-muted hover:bg-surface-2 hover:text-foreground">
        <LinkIcon2 className="h-3 w-3" />
      </button>
    </div>
  );
}

const ADD_MENU_TYPES: BlockType[] = [
  "paragraph", "heading2", "heading3", "bulletList", "numberList", "quote", "code", "image", "table", "video", "divider",
];

function AddBlockMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex justify-center py-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Add block"
        className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted opacity-0 transition hover:border-primary hover:text-primary group-hover:opacity-100 focus:opacity-100"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        Add block
      </button>
      {open && (
        <div className="absolute top-full z-20 mt-1 grid w-56 grid-cols-2 gap-1 rounded-xl border border-border bg-surface p-2 shadow-[var(--shadow-lg)]">
          {ADD_MENU_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { onAdd(t); setOpen(false); }}
              className="rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-foreground hover:bg-surface-2"
            >
              {BLOCK_LABELS[t]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

interface RowProps {
  block: Block;
  index: number;
  total: number;
  onChange: (block: Block) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onPickImage: () => void;
}

function BlockRow({ block, index, total, onChange, onDelete, onMove, onDragStart, onDragOver, onDrop, onPickImage }: RowProps) {
  const paragraphRef = useRef<HTMLTextAreaElement | null>(null);
  const headingRef = useRef<HTMLInputElement | null>(null);
  const quoteRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="group/block flex items-start gap-2 rounded-lg px-1 py-1 hover:bg-surface-2/60"
    >
      <div className="mt-1.5 flex shrink-0 cursor-grab flex-col items-center gap-0.5 opacity-0 transition group-hover/block:opacity-100" title="Drag to reorder">
        <span className="select-none text-xs leading-none text-muted">⋮⋮</span>
      </div>

      <div className="min-w-0 flex-1">
        {block.type === "paragraph" && (
          <>
            <TextToolbar elRef={paragraphRef} onChange={(text) => onChange({ ...block, text })} />
            <textarea
              value={block.text}
              onChange={(e) => { onChange({ ...block, text: e.target.value }); autoGrow(e.target); }}
              ref={(el) => { paragraphRef.current = el; autoGrow(el); }}
              placeholder="Write some text…"
              rows={1}
              className="w-full resize-none overflow-hidden bg-transparent text-sm leading-relaxed text-foreground outline-none"
            />
          </>
        )}
        {(block.type === "heading2" || block.type === "heading3") && (
          <>
            <TextToolbar elRef={headingRef} onChange={(text) => onChange({ ...block, text })} />
            <input
              ref={headingRef}
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder={block.type === "heading2" ? "Heading" : "Subheading"}
              className={`w-full bg-transparent font-bold text-foreground outline-none ${block.type === "heading2" ? "text-xl" : "text-lg"}`}
            />
          </>
        )}
        {block.type === "quote" && (
          <>
            <TextToolbar elRef={quoteRef} onChange={(text) => onChange({ ...block, text })} />
            <textarea
              value={block.text}
              onChange={(e) => { onChange({ ...block, text: e.target.value }); autoGrow(e.target); }}
              ref={(el) => { quoteRef.current = el; autoGrow(el); }}
              placeholder="Quote"
              rows={1}
              className="w-full resize-none overflow-hidden border-l-4 border-primary bg-transparent pl-3 text-sm italic text-muted outline-none"
            />
          </>
        )}
        {(block.type === "bulletList" || block.type === "numberList") && (
          <div className="flex flex-col gap-1.5">
            {block.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-4 shrink-0 text-xs text-muted">{block.type === "numberList" ? `${i + 1}.` : "•"}</span>
                <input
                  value={item}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = e.target.value;
                    onChange({ ...block, items });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const items = [...block.items];
                      items.splice(i + 1, 0, "");
                      onChange({ ...block, items });
                    } else if (e.key === "Backspace" && item === "" && block.items.length > 1) {
                      e.preventDefault();
                      const items = block.items.filter((_, idx) => idx !== i);
                      onChange({ ...block, items });
                    }
                  }}
                  placeholder="List item"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange({ ...block, items: [...block.items, ""] })}
              className="ml-6 self-start text-xs font-medium text-primary hover:underline"
            >
              + item
            </button>
          </div>
        )}
        {block.type === "code" && (
          <div className="rounded-xl border border-border bg-surface-2">
            <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
              <input
                value={block.lang}
                onChange={(e) => onChange({ ...block, lang: e.target.value })}
                placeholder="language (optional)"
                className="w-32 bg-transparent text-xs text-muted outline-none"
              />
            </div>
            <textarea
              value={block.code}
              onChange={(e) => { onChange({ ...block, code: e.target.value }); autoGrow(e.target); }}
              ref={autoGrow}
              placeholder="Code…"
              rows={2}
              className="w-full resize-none overflow-hidden bg-transparent p-3 font-mono text-xs text-foreground outline-none"
            />
          </div>
        )}
        {block.type === "image" && (
          <div className="flex flex-col gap-2">
            {block.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={block.url} alt={block.alt} className="max-h-64 rounded-lg border border-border object-cover" />
            )}
            <div className="flex gap-2">
              <input
                value={block.url}
                onChange={(e) => onChange({ ...block, url: e.target.value })}
                placeholder="Image URL"
                className="field-input flex-1 text-sm"
              />
              <button type="button" onClick={onPickImage} className="btn-ghost shrink-0 rounded-lg px-3 text-xs font-semibold">
                <ImageIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              value={block.alt}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              placeholder="Alt text"
              className="field-input text-xs"
            />
          </div>
        )}
        {block.type === "table" && (
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {block.headers.map((h, ci) => (
                    <th key={ci} className="border border-border p-1">
                      <input
                        value={h}
                        onChange={(e) => {
                          const headers = [...block.headers];
                          headers[ci] = e.target.value;
                          onChange({ ...block, headers });
                        }}
                        className="w-full bg-transparent px-1.5 py-1 text-xs font-semibold text-foreground outline-none"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-border p-1">
                        <input
                          value={cell}
                          onChange={(e) => {
                            const rows = block.rows.map((r) => [...r]);
                            rows[ri][ci] = e.target.value;
                            onChange({ ...block, rows });
                          }}
                          className="w-full bg-transparent px-1.5 py-1 text-xs text-foreground outline-none"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-1.5 flex gap-3">
              <button
                type="button"
                onClick={() => onChange({ ...block, rows: [...block.rows, block.headers.map(() => "")] })}
                className="text-xs font-medium text-primary hover:underline"
              >
                + row
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...block,
                    headers: [...block.headers, `Column ${block.headers.length + 1}`],
                    rows: block.rows.map((r) => [...r, ""]),
                  })
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                + column
              </button>
            </div>
          </div>
        )}
        {block.type === "video" && (
          <input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="YouTube or Vimeo URL"
            className="field-input w-full text-sm"
          />
        )}
        {block.type === "divider" && <hr className="my-2 border-border" />}
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1 opacity-0 transition group-hover/block:opacity-100">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move block up" className="text-muted hover:text-foreground disabled:opacity-30">
          ▲
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move block down" className="text-muted hover:text-foreground disabled:opacity-30">
          ▼
        </button>
        <button type="button" onClick={onDelete} aria-label="Delete block" className="text-muted hover:text-danger">
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function BlockEditor({ blocks, onChange }: { blocks: Block[]; onChange: (blocks: Block[]) => void }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pickerForIndex, setPickerForIndex] = useState<number | null>(null);

  function updateAt(index: number, block: Block) {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  }

  function deleteAt(index: number) {
    const next = blocks.filter((_, i) => i !== index);
    onChange(next.length ? next : [emptyBlock("paragraph")]);
  }

  function moveAt(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function insertAt(index: number, type: BlockType) {
    const next = [...blocks];
    next.splice(index + 1, 0, emptyBlock(type));
    onChange(next);
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const next = [...blocks];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    onChange(next);
    setDragIndex(null);
  }

  return (
    <div className="group flex flex-col gap-0.5 p-2">
      <AddBlockMenu onAdd={(t) => insertAt(-1, t)} />
      {blocks.map((block, i) => (
        <div key={block.id}>
          <BlockRow
            block={block}
            index={i}
            total={blocks.length}
            onChange={(b) => updateAt(i, b)}
            onDelete={() => deleteAt(i)}
            onMove={(dir) => moveAt(i, dir)}
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            onPickImage={() => setPickerForIndex(i)}
          />
          <AddBlockMenu onAdd={(t) => insertAt(i, t)} />
        </div>
      ))}
      {pickerForIndex !== null && (
        <ImagePicker
          onSelect={(item: MediaItem) => {
            const b = blocks[pickerForIndex];
            if (b.type === "image") updateAt(pickerForIndex, { ...b, url: item.url, alt: item.alt });
            setPickerForIndex(null);
          }}
          onClose={() => setPickerForIndex(null)}
        />
      )}
    </div>
  );
}
