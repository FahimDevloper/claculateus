import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog/queries";
import BlogListClient from "@/components/blog/BlogListClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides and articles on personal finance, health, productivity, and getting the most out of Calculateus's calculators.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts({ max: 100 }).catch(() => []);

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <div className="gradient-mesh opacity-50" />
        <div className="container-wide relative py-14">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            The Calculate<span className="text-gradient">us</span> Blog
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            Practical guides on personal finance, health, and productivity — plus what's new on the site.
          </p>
        </div>
      </div>
      <div className="container-wide py-12">
        <BlogListClient posts={posts} />
      </div>
    </div>
  );
}
