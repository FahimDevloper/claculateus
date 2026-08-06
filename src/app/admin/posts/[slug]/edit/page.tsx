"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostBySlug } from "@/lib/blog/queries";
import { BlogPost } from "@/lib/blog/types";
import PostEditor from "@/components/admin/PostEditor";

export default function EditPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    getPostBySlug(params.slug)
      .then(setPost)
      .catch(() => setPost(null));
  }, [params.slug]);

  if (post === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (post === null) return <p className="text-sm text-danger">Post not found.</p>;

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-foreground">Edit Post</h2>
      <PostEditor post={post} />
    </div>
  );
}
