"use client";

import { useState } from "react";
import { createPost } from "@/lib/blog/queries";
import { articlesA } from "../../../../scripts/articles-a";
import { articlesB } from "../../../../scripts/articles-b";
import { articlesC } from "../../../../scripts/articles-c";
import { articlesD } from "../../../../scripts/articles-d";
import { articlesE } from "../../../../scripts/articles-e";
import type { DraftArticle } from "../../../../scripts/article-type";

const SITE_URL = "https://www.calculateus.com";

const allArticles: DraftArticle[] = [...articlesA, ...articlesB, ...articlesC, ...articlesD, ...articlesE];

function heroImageUrl(a: DraftArticle): string {
  const params = new URLSearchParams({ title: a.title, cat: a.cat6, seed: a.calcSlug });
  return `${SITE_URL}/blog-image?${params.toString()}`;
}

type Row = { title: string; status: "pending" | "ok" | "error"; message?: string };

export default function BulkImportPage() {
  const [rows, setRows] = useState<Row[]>(allArticles.map((a) => ({ title: a.title, status: "pending" })));
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  async function runImport() {
    setRunning(true);
    setDone(false);
    for (let i = 0; i < allArticles.length; i++) {
      const a = allArticles[i];
      try {
        const imageUrl = heroImageUrl(a);
        const heroMarkdown = `![${a.title}](${imageUrl})\n\n${a.contentMarkdown}`;
        await createPost({
          title: a.title,
          excerpt: a.excerpt,
          contentMarkdown: heroMarkdown,
          featuredImageUrl: imageUrl,
          category: a.category,
          tags: a.tags,
          authorName: "Calculateus Team",
          seoTitle: a.seoTitle,
          seoDescription: a.seoDescription,
          status: "published",
        });
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "ok" } : r)));
      } catch (e) {
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "error", message: String(e) } : r)));
      }
    }
    setRunning(false);
    setDone(true);
  }

  const okCount = rows.filter((r) => r.status === "ok").length;
  const errorCount = rows.filter((r) => r.status === "error").length;

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-foreground">Bulk Import ({allArticles.length} articles)</h2>
      <p className="mb-6 text-sm text-muted">
        One-time tool to publish the drafted SEO guide articles. Safe to delete this page after running.
      </p>
      <button
        onClick={runImport}
        disabled={running || done}
        className="btn-primary mb-6 disabled:opacity-50"
      >
        {running ? `Importing... (${okCount + errorCount}/${allArticles.length})` : done ? "Done" : "Run Import"}
      </button>
      {done && (
        <p className="mb-4 text-sm font-semibold text-foreground">
          {okCount} published, {errorCount} failed.
        </p>
      )}
      <div className="max-h-[600px] overflow-y-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="px-3 py-1.5 text-muted">{i + 1}</td>
                <td className="px-3 py-1.5 text-foreground">{r.title}</td>
                <td className="px-3 py-1.5">
                  {r.status === "pending" && <span className="text-muted">—</span>}
                  {r.status === "ok" && <span className="text-success">✓ published</span>}
                  {r.status === "error" && <span className="text-danger" title={r.message}>✗ failed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
