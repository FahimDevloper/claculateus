"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPostsForAdmin, deletePost, publishNow } from "@/lib/blog/queries";
import { BlogPost, PostStatus } from "@/lib/blog/types";

const STATUS_STYLES: Record<PostStatus, string> = {
  published: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-success",
  scheduled: "bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-warning",
  draft: "bg-surface-2 text-muted",
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);

  function reload() {
    getAllPostsForAdmin()
      .then(setPosts)
      .catch(() => setPosts([]));
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this post permanently? This can't be undone.")) return;
    setBusySlug(slug);
    await deletePost(slug);
    reload();
    setBusySlug(null);
  }

  async function handlePublish(slug: string) {
    setBusySlug(slug);
    await publishNow(slug);
    reload();
    setBusySlug(null);
  }

  if (posts === null) {
    return <p className="text-sm text-muted">Loading posts…</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-muted">No posts yet.</p>
        <Link href="/admin/posts/new" className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold">
          Write your first post
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.slug} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{p.title || "(untitled)"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-muted">{p.category}</td>
                <td className="px-4 py-3 text-muted">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    {p.status !== "published" && (
                      <button disabled={busySlug === p.slug} onClick={() => handlePublish(p.slug)} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">
                        Publish
                      </button>
                    )}
                    <Link href={`/admin/posts/${p.slug}/edit`} className="text-xs font-semibold text-foreground hover:text-primary">
                      Edit
                    </Link>
                    <button disabled={busySlug === p.slug} onClick={() => handleDelete(p.slug)} className="text-xs font-semibold text-danger hover:underline disabled:opacity-50">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
