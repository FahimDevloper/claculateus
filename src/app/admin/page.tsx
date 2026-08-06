"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/blog/queries";
import { BlogPost } from "@/lib/blog/types";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    getAllPostsForAdmin()
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  const published = posts?.filter((p) => p.status === "published").length ?? 0;
  const drafts = posts?.filter((p) => p.status === "draft").length ?? 0;
  const scheduled = posts?.filter((p) => p.status === "scheduled").length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Published</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{posts === null ? "—" : published}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Scheduled</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{posts === null ? "—" : scheduled}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Drafts</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{posts === null ? "—" : drafts}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-foreground">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/posts/new" className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold">
            Write a new post
          </Link>
          <Link href="/admin/posts" className="btn-ghost rounded-lg px-4 py-2 text-sm font-semibold">
            Manage all posts
          </Link>
          <Link href="/blog" target="_blank" className="btn-ghost rounded-lg px-4 py-2 text-sm font-semibold">
            View live blog →
          </Link>
        </div>
      </div>

      {posts !== null && posts.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-foreground">Recently updated</h2>
          <div className="mt-4 flex flex-col divide-y divide-border">
            {posts.slice(0, 5).map((p) => (
              <Link key={p.slug} href={`/admin/posts/${p.slug}/edit`} className="flex items-center justify-between py-3 text-sm hover:text-primary">
                <span className="font-medium text-foreground">{p.title || "(untitled)"}</span>
                <span className="text-xs capitalize text-muted">{p.status}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
