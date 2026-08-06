import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog/queries";
import { getBlogCategory } from "@/lib/blog/types";
import { renderMarkdown } from "@/lib/markdown";
import Reveal from "@/components/motion/Reveal";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButtons from "@/components/blog/ShareButtons";
import CommentsSection from "@/components/blog/CommentsSection";
import PostCard from "@/components/blog/PostCard";

export const revalidate = 60;

function formatDate(ts: number | null | undefined): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "published") return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "published") notFound();

  const { html, headings } = renderMarkdown(post.contentMarkdown);
  const related = await getRelatedPosts(post).catch(() => []);
  const cat = getBlogCategory(post.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImageUrl || undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: { "@type": "Person", name: post.authorName },
  };

  return (
    <div>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative overflow-hidden border-b border-border">
        <div className="gradient-mesh opacity-50" />
        <div className="container-wide relative py-12">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            {cat && (
              <>
                <span>/</span>
                <Link href={`/blog/category/${cat.slug}`} className="hover:text-primary">{cat.title}</Link>
              </>
            )}
          </nav>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">{post.authorName}</p>
              <p className="text-muted">
                {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
              </p>
            </div>
            <div className="ml-auto">
              <ShareButtons title={post.title} />
            </div>
          </div>
        </div>
      </div>

      {post.featuredImageUrl && (
        <div className="container-wide pt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="h-56 w-full rounded-2xl border border-border object-cover sm:h-72 lg:h-96"
          />
        </div>
      )}

      <div className="container-wide py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <article className="prose-legal max-w-[72ch] [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-foreground [&_a]:text-primary [&_strong]:text-foreground [&_li]:text-foreground">
            <div dangerouslySetInnerHTML={{ __html: html }} />

            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {post.authorBio && (
              <div className="glass mt-10 flex gap-4 rounded-2xl p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{post.authorName}</p>
                  <p className="mt-1 text-sm text-muted">{post.authorBio}</p>
                </div>
              </div>
            )}

            <CommentsSection postSlug={post.slug} />
          </article>

          <TableOfContents headings={headings} />
        </div>

        {related.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-xl font-bold text-foreground">Related articles</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
