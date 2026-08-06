import Link from "next/link";
import { getCalculator } from "@/lib/calculators/registry";
import Reveal from "@/components/motion/Reveal";

interface Collection {
  title: string;
  description: string;
  emoji: string;
  slugs: string[];
}

const COLLECTIONS: Collection[] = [
  { title: "Home Buying Toolkit", description: "Everything for your next home purchase.", emoji: "🏡", slugs: ["mortgage", "house-affordability", "down-payment", "mortgage-payoff"] },
  { title: "Tax Season Essentials", description: "File with confidence.", emoji: "🧾", slugs: ["income-tax", "tax-refund-estimator", "w2-tax", "1099-tax"] },
  { title: "Fitness & Nutrition", description: "Know your numbers.", emoji: "💪", slugs: ["bmi", "calorie", "body-fat", "macro"] },
  { title: "Student Toolkit", description: "For grades and coursework.", emoji: "🎓", slugs: ["gpa", "final-grade", "percentage", "standard-deviation"] },
  { title: "Everyday Money", description: "Quick, practical, useful.", emoji: "💸", slugs: ["tip", "discount", "sales-tax", "unit-price"] },
  { title: "Building Wealth", description: "Grow it, then plan for retirement.", emoji: "📈", slugs: ["compound-interest", "investment", "retirement", "fire-number"] },
];

export default function FeaturedCollections() {
  return (
    <section className="py-14">
      <Reveal className="container-wide mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Featured collections</h2>
        <p className="mt-1 text-muted">Curated groups of calculators for common goals — scroll to browse.</p>
      </Reveal>
      <div className="scrollbar-thin container-wide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {COLLECTIONS.map((col) => {
          const calcs = col.slugs.map((s) => getCalculator(s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
          if (calcs.length === 0) return null;
          return (
            <div key={col.title} className="card-lg flex w-[260px] shrink-0 snap-start flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{col.emoji}</span>
                <div>
                  <h3 className="font-bold text-foreground">{col.title}</h3>
                  <p className="text-xs text-muted">{col.description}</p>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5">
                {calcs.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/calculators/${c.slug}`} className="text-sm text-muted transition-colors hover:text-primary">
                      {c.shortTitle ?? c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
