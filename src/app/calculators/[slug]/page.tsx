import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allCalculators, getCalculator, getCalculatorsByCategory } from "@/lib/calculators/registry";
import { getCategory } from "@/lib/calculators/categories";
import CalculatorPageClient from "@/components/calculators/CalculatorPageClient";
import ViewTracker from "@/components/calculators/ViewTracker";
import FavoriteButton from "@/components/calculators/FavoriteButton";
import Reveal from "@/components/motion/Reveal";
import SeoContent, { SeoConclusion } from "@/components/calculators/SeoContent";
import ContentByline from "@/components/calculators/ContentByline";
import { getSeoContent } from "@/lib/calculators/content";
import { getCalculatorOverride } from "@/lib/admin/calculatorOverrides";
import { getRelatedArticles } from "@/lib/blog/relatedArticles";
import { getReferences } from "@/lib/calculators/references";
import { expandKeywords } from "@/lib/calculators/keywordExpansion";

export function generateStaticParams() {
  return allCalculators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const def = getCalculator(slug);
  if (!def) return {};
  const override = await getCalculatorOverride(slug);
  return {
    title: override?.seoTitle || def.title,
    description: override?.seoDescription || def.description,
    keywords: expandKeywords(def),
    alternates: { canonical: `/calculators/${def.slug}` },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = getCalculator(slug);
  if (!def) notFound();
  const cat = getCategory(def.category);
  const related = getCalculatorsByCategory(def.category).filter((c) => c.slug !== def.slug).slice(0, 4);
  const seoContent = getSeoContent(def.slug);
  const relatedArticles = await getRelatedArticles(def.category);
  const references = getReferences(def.category);

  const siteUrl = "https://calculateus.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: def.title,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: def.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      ...(cat ? [{ "@type": "ListItem", position: 2, name: cat.title, item: `${siteUrl}/${cat.slug}` }] : []),
      { "@type": "ListItem", position: cat ? 3 : 2, name: def.title, item: `${siteUrl}/calculators/${def.slug}` },
    ],
  };

  const faqJsonLd = def.faqs && def.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: def.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <ViewTracker slug={def.slug} title={def.title} />

      <div className="relative overflow-hidden border-b border-border">
        <div className="gradient-mesh opacity-50" />
        <div className="container-wide relative py-10">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            {cat && (
              <>
                <Link href={`/${cat.slug}`} className="hover:text-primary">{cat.title}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{def.title}</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{def.title}</h1>
              <p className="mt-2 max-w-2xl text-muted">{def.intro ?? def.description}</p>
            </div>
            <FavoriteButton slug={def.slug} />
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <CalculatorPageClient slug={def.slug} />

        {seoContent && <SeoContent content={seoContent} title={def.shortTitle ?? def.title} />}
        {seoContent && <ContentByline />}

        {def.faqs && def.faqs.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
            <div className="mt-4 flex flex-col divide-y divide-border">
              {def.faqs.map((f, i) => (
                <div key={i} className="py-4">
                  <h3 className="text-sm font-semibold text-foreground">{f.q}</h3>
                  <p className="mt-1.5 text-sm text-muted">{f.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {related.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-xl font-bold text-foreground">Related calculators</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/calculators/${c.slug}`}
                  className="card group flex flex-col gap-1.5 p-4 transition hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-md)]"
                >
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">{c.title}</span>
                  <span className="text-xs text-muted line-clamp-2">{c.description}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {relatedArticles.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-xl font-bold text-foreground">Related articles</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card group flex flex-col gap-1.5 p-4 transition hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-md)]"
                >
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">{post.title}</span>
                  <span className="text-xs text-muted line-clamp-2">{post.excerpt}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {seoContent && <SeoConclusion text={seoContent.conclusion} />}

        {references.length > 0 && (
          <Reveal className="mt-10">
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted">References</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {references.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                    {r.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </div>
  );
}
