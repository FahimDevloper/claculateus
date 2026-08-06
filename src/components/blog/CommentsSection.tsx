"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getComments, addComment, deleteComment } from "@/lib/blog/queries";
import { BlogComment } from "@/lib/blog/types";
import { isAdminEmail } from "@/lib/admin/config";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentsSection({ postSlug }: { postSlug: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getComments(postSlug)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [postSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSubmitting(true);
    try {
      await addComment(postSlug, user.uid, user.displayName ?? user.email ?? "Anonymous", text.trim());
      setText("");
      setComments(await getComments(postSlug));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteComment(postSlug, id);
    setComments((c) => c.filter((cm) => cm.id !== id));
  }

  return (
    <section className="mt-16 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground">
        Comments {comments.length > 0 && <span className="text-muted">({comments.length})</span>}
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts…"
            rows={3}
            maxLength={2000}
            className="field-input resize-none"
          />
          <button type="submit" disabled={submitting || !text.trim()} className="btn-primary self-end rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
            {submitting ? "Posting…" : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted">Sign in to join the conversation.</p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          <p className="text-sm text-muted">Loading comments…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted">No comments yet — be the first to share your thoughts.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-bold text-muted">
                {c.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{c.authorName}</span>
                  <span className="text-xs text-muted">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted">{c.text}</p>
                {user && (user.uid === c.authorUid || isAdminEmail(user.email)) && (
                  <button onClick={() => handleDelete(c.id)} className="mt-1 text-xs text-danger hover:underline">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
