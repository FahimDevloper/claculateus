"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { allCalculators } from "@/lib/calculators/registry";
import { categories } from "@/lib/calculators/categories";
import { CategoryIcon } from "@/components/icons";
import SignatureCalculator from "@/components/calculators/SignatureCalculator";
import HomeSearch from "@/components/search/HomeSearch";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero({ headline, subheadline }: { headline?: string; subheadline?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="gradient-mesh" />
      <div className="container-wide relative py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <motion.div variants={container} initial={false} animate="show">
            <motion.span variants={item} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
              {allCalculators.length}+ free calculators, zero sign-up
            </motion.span>
            <motion.h1 variants={item} className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
              {headline || (
                <>
                  Every calculator you&apos;ll ever need,
                  <span className="text-gradient"> in one place.</span>
                </>
              )}
            </motion.h1>
            <motion.p variants={item} className="mt-4 max-w-xl text-lg text-muted">
              {subheadline || "Financial, health, math, and everyday calculators built for speed and accuracy — no ad clutter, no clunky forms, just instant answers."}
            </motion.p>
            <motion.div variants={item} className="mt-8 max-w-lg">
              <HomeSearch />
            </motion.div>
            <motion.div variants={item} className="mt-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  prefetch={false}
                  className="group flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3.5 py-2 text-sm font-medium text-foreground backdrop-blur transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <CategoryIcon icon={c.icon} width={15} height={15} className="text-muted transition group-hover:text-primary" />
                  {c.title}
                </Link>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <SignatureCalculator compact />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
