"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BLOG_CATEGORIES } from "@/lib/blog/types";
import { BlogPost, PostStatus } from "@/lib/blog/types";
import { createPost, updatePost, getRevisions, PostInput, PostRevision } from "@/lib/blog/queries";
import { renderMarkdown } from "@/lib/markdown";
import { Block, markdownToBlocks, blocksToMarkdown } from "@/lib/blog/blocks";
import BlockEditor from "./BlockEditor";
import { slugify } from "@/lib/slugify";
import { MediaItem } from "@/lib/admin/media";
import ImagePicker from "./ImagePicker";
import { SparklesIcon, ClockIcon } from "@/components/icons";
import { getAiSettings } from "@/lib/admin/aiSettings";
import { generateWithAi } from "@/lib/admin/aiGenerate";

const AI_SYSTEM_PROMPT =
  "You are a professional content writer for Calculateus.com, a calculator and personal-finance/health/math education website. Write a complete, accurate, genuinely helpful blog article in Markdown, aimed at a general reader. Respond in exactly this format with no extra commentary before or after it:\nTITLE: <article title>\nEXCERPT: <one-sentence summary, under 160 characters>\n---\n<full article body in Markdown, using ## for section headings, several hundred words>";

function parseAiArticle(raw: string): { title: string; excerpt: string; body: string } | null {
  const m = raw.match(/TITLE:\s*(.+)\r?\nEXCERPT:\s*(.+)\r?\n-{3,}\r?\n([\s\S]+)/);
  if (!m) return null;
  return { title: m[1].trim(), excerpt: m[2].trim(), body: m[3].trim() };
}

function toDatetimeLocal(ts: number | null | undefined): string {
  if (!ts) return "";
  const d = new Date(ts);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function PostEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slugPreview, setSlugPreview] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [blocks, setBlocks] = useState<Block[]>(() => markdownToBlocks(post?.contentMarkdown ?? ""));
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featuredImageUrl ?? "");
  const [category, setCategory] = useState(post?.category ?? BLOG_CATEGORIES[0].slug);
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [authorName, setAuthorName] = useState(post?.authorName ?? user?.displayName ?? "Calculateus Team");
  const [authorBio, setAuthorBio] = useState(post?.authorBio ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [scheduledFor, setScheduledFor] = useState(toDatetimeLocal(post?.scheduledFor));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuredPickerOpen, setFeaturedPickerOpen] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const skipNextAutosave = useRef(true);
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<PostRevision[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (!isEdit || !post) return;
    getRevisions(post.slug).then(setRevisions).catch(() => setRevisions([]));
  }, [isEdit, post]);

  const content = useMemo(() => blocksToMarkdown(blocks), [blocks]);
  const preview = useMemo(() => renderMarkdown(content), [content]);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlugPreview(slugify(v));
  }

  function buildInput(): PostInput {
    return {
      title: title.trim(),
      excerpt: excerpt.trim(),
      contentMarkdown: content,
      featuredImageUrl: featuredImageUrl.trim(),
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      authorName: authorName.trim() || "Calculateus Team",
      authorBio: authorBio.trim(),
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      status,
      scheduledFor: status === "scheduled" ? new Date(scheduledFor).getTime() : null,
    };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (status === "scheduled" && !scheduledFor) {
      setError("Pick a date/time for scheduled posts.");
      return;
    }
    setSaving(true);
    try {
      const input = buildInput();

      if (isEdit && post) {
        await updatePost(post.slug, input);
        router.push("/admin/posts");
      } else {
        const newSlug = await createPost(input);
        router.push(`/admin/posts/${newSlug}/edit`);
      }
    } catch {
      setError("Couldn't save the post. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Autosave: only for existing posts, so we never silently create duplicates.
  useEffect(() => {
    if (!isEdit || !post) return;
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return;
    }
    if (!title.trim() || !content.trim()) return;
    if (status === "scheduled" && !scheduledFor) return;

    const timer = setTimeout(async () => {
      if (saving) return;
      setAutosaveStatus("saving");
      try {
        await updatePost(post.slug, buildInput());
        setAutosaveStatus("saved");
        setLastSavedAt(Date.now());
      } catch {
        setAutosaveStatus("error");
      }
    }, 2500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, excerpt, content, featuredImageUrl, category, tags, authorName, authorBio, seoTitle, seoDescription, status, scheduledFor]);

  function restoreRevision(rev: PostRevision) {
    setTitle(rev.title);
    setSlugPreview((prev) => (isEdit ? prev : slugify(rev.title)));
    setExcerpt(rev.excerpt);
    setBlocks(markdownToBlocks(rev.contentMarkdown));
    setFeaturedImageUrl(rev.featuredImageUrl);
    setCategory(rev.category);
    setTags(rev.tags.join(", "));
    setAuthorName(rev.authorName);
    setAuthorBio(rev.authorBio);
    setSeoTitle(rev.seoTitle);
    setSeoDescription(rev.seoDescription);
    setStatus(rev.status);
    setHistoryOpen(false);
  }

  async function handleAiGenerate() {
    if (!aiTopic.trim()) return;
    setAiGenerating(true);
    setAiError(null);
    try {
      const settings = await getAiSettings();
      const raw = await generateWithAi(settings, settings.defaultProvider, AI_SYSTEM_PROMPT, aiTopic.trim());
      const parsed = parseAiArticle(raw);
      if (parsed) {
        handleTitleChange(parsed.title);
        setExcerpt(parsed.excerpt);
        setBlocks(markdownToBlocks(parsed.body));
      } else {
        setBlocks(markdownToBlocks(raw));
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Something went wrong generating this article.");
    } finally {
      setAiGenerating(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          className="field-input text-lg font-semibold"
        />
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Slug {isEdit && "(locked after publishing)"}
          <input
            value={slugPreview}
            onChange={(e) => { setSlugPreview(slugify(e.target.value)); setSlugTouched(true); }}
            disabled={isEdit}
            className="field-input font-mono text-sm disabled:opacity-60"
          />
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt (shown on cards and in search results)"
          rows={2}
          className="field-input resize-none"
        />

        <div className="card overflow-hidden">
          <div className="flex gap-1 border-b border-border bg-surface-2 p-1.5">
            <button type="button" onClick={() => setTab("write")} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${tab === "write" ? "bg-primary text-primary-foreground" : "text-muted"}`}>
              Write
            </button>
            <button type="button" onClick={() => setTab("preview")} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${tab === "preview" ? "bg-primary text-primary-foreground" : "text-muted"}`}>
              Preview
            </button>
            <span className="ml-auto self-center pr-2 text-xs text-muted">{preview.wordCount} words · {Math.max(1, Math.round(preview.wordCount / 200))} min read</span>
          </div>
          {tab === "write" ? (
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          ) : (
            <div
              className="min-h-[20rem] p-4 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-bold [&_p]:mt-3 [&_a]:text-primary"
              dangerouslySetInnerHTML={{ __html: preview.html || "<p class='text-muted'>Nothing to preview yet.</p>" }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="card flex flex-col gap-3 p-4">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <SparklesIcon className="h-4 w-4 text-primary" />
            Generate with AI
          </h3>
          <textarea
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="What should this article be about? e.g. &quot;How PMI works and when it drops off a mortgage&quot;"
            rows={3}
            className="field-input resize-none text-sm"
          />
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiGenerating || !aiTopic.trim()}
            className="btn-primary rounded-lg py-2 text-sm font-semibold disabled:opacity-60"
          >
            {aiGenerating ? "Writing…" : "Generate draft"}
          </button>
          {aiError && (
            <p className="text-xs text-danger">
              {aiError}{" "}
              <a href="/admin/ai" target="_blank" rel="noreferrer" className="underline">
                Manage keys
              </a>
            </p>
          )}
          <p className="text-[11px] text-muted">Replaces title, excerpt, and content below with a full draft you can edit.</p>
        </div>

        <div className="card flex flex-col gap-3 p-4">
          <h3 className="text-sm font-semibold text-foreground">Publish</h3>
          <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className="field-input">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
          {status === "scheduled" && (
            <input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} className="field-input" />
          )}
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary rounded-lg py-2 text-sm font-semibold disabled:opacity-60">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create post"}
          </button>
          {isEdit && (
            <p className="text-center text-[11px] text-muted">
              {autosaveStatus === "saving" && "Autosaving…"}
              {autosaveStatus === "saved" && lastSavedAt && `Autosaved · ${new Date(lastSavedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
              {autosaveStatus === "error" && "Autosave failed — use Save changes"}
              {autosaveStatus === "idle" && "Changes autosave as you type"}
            </p>
          )}
        </div>

        {isEdit && (
          <div className="card flex flex-col gap-3 p-4">
            <button
              type="button"
              onClick={() => setHistoryOpen((o) => !o)}
              aria-expanded={historyOpen}
              className="flex items-center justify-between gap-2 text-left"
            >
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <ClockIcon className="h-4 w-4 text-muted" />
                History {revisions.length > 0 && `(${revisions.length})`}
              </h3>
              <span className="text-muted">{historyOpen ? "▴" : "▾"}</span>
            </button>
            {historyOpen && (
              revisions.length === 0 ? (
                <p className="text-xs text-muted">
                  No checkpoints yet — one is saved automatically at most every 5 minutes as you edit.
                </p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {revisions.map((rev) => (
                    <li key={rev.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs">
                      <span className="text-muted">
                        {new Date(rev.savedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </span>
                      <button
                        type="button"
                        onClick={() => restoreRevision(rev)}
                        className="font-semibold text-primary hover:underline"
                      >
                        Restore
                      </button>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        )}

        <div className="card flex flex-col gap-3 p-4">
          <h3 className="text-sm font-semibold text-foreground">Organize</h3>
          <label className="flex flex-col gap-1 text-xs text-muted">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="field-input">
              {BLOG_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted">
            Tags (comma separated)
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="field-input" placeholder="budgeting, tips" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted">
            Featured image
            <div className="flex gap-2">
              <input value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} className="field-input" placeholder="https://…" />
              <button type="button" onClick={() => setFeaturedPickerOpen(true)} className="btn-ghost shrink-0 rounded-lg px-3 text-xs font-semibold">
                Browse
              </button>
            </div>
          </label>
          {featuredImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={featuredImageUrl} alt="" className="h-28 w-full rounded-lg border border-border object-cover" />
          )}
        </div>

        <div className="card flex flex-col gap-3 p-4">
          <h3 className="text-sm font-semibold text-foreground">Author</h3>
          <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="field-input" placeholder="Author name" />
          <textarea value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} rows={2} className="field-input resize-none" placeholder="Short bio (optional)" />
        </div>

        <div className="card flex flex-col gap-3 p-4">
          <h3 className="text-sm font-semibold text-foreground">SEO</h3>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="field-input" placeholder={title || "SEO title (optional)"} />
          <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} className="field-input resize-none" placeholder={excerpt || "SEO description (optional)"} />
        </div>
      </div>
      {featuredPickerOpen && (
        <ImagePicker
          onSelect={(item: MediaItem) => { setFeaturedImageUrl(item.url); setFeaturedPickerOpen(false); }}
          onClose={() => setFeaturedPickerOpen(false)}
        />
      )}
    </form>
  );
}
