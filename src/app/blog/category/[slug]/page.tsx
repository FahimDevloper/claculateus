import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog/queries";
import { BLOG_CATEGORIES, getBlogCategory } from "@/lib/blog/types";
import BlogListClient from "@/components/blog/BlogListClient";

export const revalidate = 60;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getBlogCategory(slug);
  if (!cat) return {};
  return { title: `${cat.title} Articles`, description: cat.description };
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getBlogCategory(slug);
  if (!cat) notFound();

  const posts = await getPublishedPosts({ category: slug, max: 100 }).catch(() => []);

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <div className="gradient-mesh opacity-50" />
        <div className="container-wide relative py-14">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{cat.title}</h1>
          <p className="mt-2 max-w-xl text-muted">{cat.description}</p>
        </div>
      </div>
      <div className="container-wide py-12">
        <BlogListClient posts={posts} />
      </div>
    </div>
  );
}
