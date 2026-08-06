"use client";

import { useMemo, useState } from "react";
import { BlogPost, BLOG_CATEGORIES } from "@/lib/blog/types";
import PostCard from "./PostCard";
import Reveal from "@/components/motion/Reveal";

const PAGE_SIZE = 9;

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q) return true;
      return `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(q);
    });
  }, [posts, query, category]);

  const [featured, ...rest] = filtered;
  const shown = rest.slice(0, visible - 1);

  if (posts.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted">No posts published yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
          placeholder="Search articles…"
          className="field-input sm:max-w-xs"
        />
        <div className="scrollbar-thin flex gap-2 overflow-x-auto">
          <button
            onClick={() => { setCategory(null); setVisible(PAGE_SIZE); }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${!category ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted hover:text-foreground"}`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => { setCategory(c.slug); setVisible(PAGE_SIZE); }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${category === c.slug ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted hover:text-foreground"}`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No articles match your search.</p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured && (
              <Reveal className="sm:col-span-2 lg:col-span-3">
                <PostCard post={featured} featured />
              </Reveal>
            )}
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i * 0.03, 0.2)}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
          {visible - 1 < rest.length && (
            <div className="mt-8 text-center">
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-ghost rounded-full px-6 py-2.5 text-sm font-semibold">
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
