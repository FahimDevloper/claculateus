import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog/queries";
import PostCard from "@/components/blog/PostCard";
import Reveal from "@/components/motion/Reveal";

export default async function BlogHighlights() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    posts = await getPublishedPosts({ max: 3 });
  } catch {
    return null;
  }
  if (posts.length === 0) return null;

  return (
    <section className="container-wide py-14">
      <Reveal className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">From the blog</h2>
          <p className="mt-1 text-muted">Guides on finance, health, and productivity.</p>
        </div>
        <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
          View all →
        </Link>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
