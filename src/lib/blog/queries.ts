import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit as fsLimit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";
import { renderMarkdown } from "@/lib/markdown";
import { slugify } from "@/lib/slugify";
import { BlogPost, BlogComment, PostStatus } from "./types";

const POSTS_COLLECTION = "posts";

function toPost(id: string, data: Record<string, unknown>): BlogPost {
  return {
    slug: id,
    title: (data.title as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    contentMarkdown: (data.contentMarkdown as string) ?? "",
    featuredImageUrl: (data.featuredImageUrl as string) ?? "",
    category: (data.category as string) ?? "guides",
    tags: (data.tags as string[]) ?? [],
    authorName: (data.authorName as string) ?? "Calculateus Team",
    authorBio: (data.authorBio as string) ?? "",
    status: (data.status as PostStatus) ?? "draft",
    scheduledFor: (data.scheduledFor as number) ?? null,
    publishedAt: (data.publishedAt as number) ?? null,
    seoTitle: (data.seoTitle as string) ?? "",
    seoDescription: (data.seoDescription as string) ?? "",
    readingTimeMinutes: (data.readingTimeMinutes as number) ?? 1,
    createdAt: (data.createdAt as number) ?? Date.now(),
    updatedAt: (data.updatedAt as number) ?? Date.now(),
  };
}

export async function getPublishedPosts(opts: { category?: string; max?: number } = {}): Promise<BlogPost[]> {
  const constraints = [where("status", "==", "published"), orderBy("publishedAt", "desc")];
  if (opts.category) constraints.unshift(where("category", "==", opts.category));
  const q = query(collection(db, POSTS_COLLECTION), ...constraints, fsLimit(opts.max ?? 100));
  const snap = await withTimeout(getDocs(q));
  return snap.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const snap = await withTimeout(getDoc(doc(db, POSTS_COLLECTION, slug)));
  if (!snap.exists()) return null;
  return toPost(snap.id, snap.data());
}

export async function getRelatedPosts(post: BlogPost, max = 3): Promise<BlogPost[]> {
  const all = await getPublishedPosts({ category: post.category, max: max + 1 });
  return all.filter((p) => p.slug !== post.slug).slice(0, max);
}

/** Admin-only: every post regardless of status, ordered by most recently updated. */
export async function getAllPostsForAdmin(): Promise<BlogPost[]> {
  const snap = await withTimeout(getDocs(query(collection(db, POSTS_COLLECTION), orderBy("updatedAt", "desc"))));
  const posts = snap.docs.map((d) => toPost(d.id, d.data()));

  const now = Date.now();
  const due = posts.filter((p) => p.status === "scheduled" && p.scheduledFor && p.scheduledFor <= now);
  for (const p of due) {
    await updateDoc(doc(db, POSTS_COLLECTION, p.slug), { status: "published", publishedAt: now, updatedAt: now });
    p.status = "published";
    p.publishedAt = now;
  }
  return posts;
}

function uniqueSlugCandidate(base: string, existing: Set<string>): string {
  if (!existing.has(base)) return base;
  let n = 2;
  while (existing.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export interface PostInput {
  title: string;
  excerpt: string;
  contentMarkdown: string;
  featuredImageUrl?: string;
  category: string;
  tags: string[];
  authorName: string;
  authorBio?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: PostStatus;
  scheduledFor?: number | null;
}

export async function createPost(input: PostInput): Promise<string> {
  const base = slugify(input.title) || "post";
  const existingSnap = await withTimeout(getDocs(collection(db, POSTS_COLLECTION)));
  const existingSlugs = new Set(existingSnap.docs.map((d) => d.id));
  const slug = uniqueSlugCandidate(base, existingSlugs);

  const { wordCount } = renderMarkdown(input.contentMarkdown);
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));
  const now = Date.now();
  const publishedAt = input.status === "published" ? now : null;

  await withTimeout(
    setDoc(doc(db, POSTS_COLLECTION, slug), {
      ...input,
      readingTimeMinutes,
      createdAt: now,
      updatedAt: now,
      publishedAt,
    })
  );
  return slug;
}

// Revisions are checkpointed at most once every 5 minutes per post (not on every
// autosave tick) so a long editing session doesn't flood the subcollection —
// closer to how Docs/Notion coalesce history into meaningful checkpoints.
const REVISION_MIN_INTERVAL_MS = 5 * 60 * 1000;
const MAX_REVISIONS = 20;

export interface PostRevision {
  id: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  featuredImageUrl: string;
  category: string;
  tags: string[];
  authorName: string;
  authorBio: string;
  seoTitle: string;
  seoDescription: string;
  status: PostStatus;
  savedAt: number;
}

async function maybeRecordRevision(slug: string, existing: BlogPost): Promise<void> {
  const revCol = collection(db, POSTS_COLLECTION, slug, "revisions");
  const recentSnap = await withTimeout(getDocs(query(revCol, orderBy("savedAt", "desc"), fsLimit(1))));
  const lastSavedAt = recentSnap.docs[0]?.data().savedAt as number | undefined;
  if (lastSavedAt && Date.now() - lastSavedAt < REVISION_MIN_INTERVAL_MS) return;

  await withTimeout(
    addDoc(revCol, {
      title: existing.title,
      excerpt: existing.excerpt,
      contentMarkdown: existing.contentMarkdown,
      featuredImageUrl: existing.featuredImageUrl,
      category: existing.category,
      tags: existing.tags,
      authorName: existing.authorName,
      authorBio: existing.authorBio,
      seoTitle: existing.seoTitle,
      seoDescription: existing.seoDescription,
      status: existing.status,
      savedAt: Date.now(),
    })
  );

  const allSnap = await withTimeout(getDocs(query(revCol, orderBy("savedAt", "desc"))));
  const excess = allSnap.docs.slice(MAX_REVISIONS);
  await Promise.all(excess.map((d) => deleteDoc(d.ref)));
}

export async function getRevisions(slug: string): Promise<PostRevision[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, POSTS_COLLECTION, slug, "revisions"), orderBy("savedAt", "desc")))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PostRevision, "id">) }));
}

export async function updatePost(slug: string, input: PostInput): Promise<void> {
  const { wordCount } = renderMarkdown(input.contentMarkdown);
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));
  const now = Date.now();

  const existing = await getPostBySlug(slug);
  const publishedAt =
    input.status === "published" ? existing?.publishedAt ?? now : existing?.status === "published" ? existing.publishedAt : null;

  if (existing) {
    // A checkpoint failure (e.g. rules not yet deployed for a fresh subcollection)
    // should never block the actual save the admin is waiting on.
    await maybeRecordRevision(slug, existing).catch(() => {});
  }

  await withTimeout(
    updateDoc(doc(db, POSTS_COLLECTION, slug), {
      ...input,
      readingTimeMinutes,
      updatedAt: now,
      publishedAt,
    })
  );
}

export async function deletePost(slug: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, POSTS_COLLECTION, slug)));
}

export async function publishNow(slug: string): Promise<void> {
  const now = Date.now();
  await withTimeout(updateDoc(doc(db, POSTS_COLLECTION, slug), { status: "published", publishedAt: now, updatedAt: now }));
}

// --- Comments ---

export async function getComments(postSlug: string): Promise<BlogComment[]> {
  const snap = await withTimeout(getDocs(query(collection(db, POSTS_COLLECTION, postSlug, "comments"), orderBy("createdAt", "desc"))));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogComment, "id">) }));
}

export async function addComment(postSlug: string, authorUid: string, authorName: string, text: string): Promise<void> {
  await withTimeout(
    addDoc(collection(db, POSTS_COLLECTION, postSlug, "comments"), {
      authorUid,
      authorName,
      text,
      createdAt: Date.now(),
    })
  );
}

export async function deleteComment(postSlug: string, commentId: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, POSTS_COLLECTION, postSlug, "comments", commentId)));
}
