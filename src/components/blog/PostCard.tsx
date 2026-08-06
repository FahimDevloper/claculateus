import Link from "next/link";
import { BlogPost } from "@/lib/blog/types";
import { getBlogCategory } from "@/lib/blog/types";

function formatDate(ts: number | null | undefined): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PostCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  const cat = getBlogCategory(post.category);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-md)] ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      {post.featuredImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.featuredImageUrl}
          alt={post.title}
          className={`w-full object-cover ${featured ? "h-64" : "h-40"}`}
          loading="lazy"
        />
      ) : (
        <div className={`w-full bg-gradient-to-br from-[color-mix(in_oklab,var(--primary)_18%,transparent)] to-[color-mix(in_oklab,var(--accent2)_18%,transparent)] ${featured ? "h-64" : "h-40"}`} />
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {cat && <span className="text-xs font-semibold uppercase tracking-wide text-primary">{cat.title}</span>}
        <h3 className={`font-bold text-foreground group-hover:text-primary ${featured ? "text-xl" : "text-base"}`}>{post.title}</h3>
        <p className="line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted">
          <span>{post.authorName}</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}
