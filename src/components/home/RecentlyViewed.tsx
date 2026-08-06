"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getRecentCalculators, DATA_MERGED_EVENT } from "@/lib/storage";
import { getCalculator } from "@/lib/calculators/registry";

export default function RecentlyViewed() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getRecentCalculators());
    function onMerge() {
      setSlugs(getRecentCalculators());
    }
    window.addEventListener(DATA_MERGED_EVENT, onMerge);
    return () => window.removeEventListener(DATA_MERGED_EVENT, onMerge);
  }, []);

  const calcs = slugs.map((s) => getCalculator(s)).filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (calcs.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container-wide py-8"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Continue where you left off</h2>
      <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
        {calcs.map((c) => (
          <Link
            key={c.slug}
            href={`/calculators/${c.slug}`}
            className="glass shrink-0 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:border-primary"
          >
            {c.shortTitle ?? c.title}
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
