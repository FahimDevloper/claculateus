"use client";

import PostEditor from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-foreground">New Post</h2>
      <PostEditor />
    </div>
  );
}
