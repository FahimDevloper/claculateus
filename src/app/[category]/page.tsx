import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getCategory } from "@/lib/calculators/categories";
import { getCalculatorsByCategory } from "@/lib/calculators/registry";
import { CategoryIcon } from "@/components/icons";
import Reveal from "@/components/motion/Reveal";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: `${cat.title} Calculators`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const calcs = getCalculatorsByCategory(cat.slug);
  const siteUrl = "https://calculateus.com";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: `${cat.title} Calculators`, item: `${siteUrl}/${cat.slug}` },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.title} Calculators`,
    itemListElement: calcs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `${siteUrl}/calculators/${c.slug}`,
    })),
  };

  return (
    <div className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {calcs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />}
      <div className="relative overflow-hidden border-b border-border">
        <div className="gradient-mesh opacity-60" />
        <div className="container-wide relative py-14">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">{cat.title}</span>
          </nav>
          <Reveal className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary">
              <CategoryIcon icon={cat.icon} width={28} height={28} />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{cat.title} Calculators</h1>
              <p className="mt-1 max-w-xl text-muted">{cat.description}</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-wide py-12">
        {calcs.length === 0 ? (
          <p className="text-muted">More {cat.title.toLowerCase()} calculators are on the way.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calcs.map((c, i) => (
              <Reveal key={c.slug} delay={Math.min(i * 0.03, 0.3)}>
                <Link
                  href={`/calculators/${c.slug}`}
                  className="card group flex h-full flex-col gap-2 p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-md)]"
                >
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">{c.title}</span>
                  <span className="text-xs text-muted line-clamp-2">{c.description}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
