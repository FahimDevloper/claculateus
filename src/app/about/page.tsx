import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { allCalculators } from "@/lib/calculators/registry";
import { categories } from "@/lib/calculators/categories";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Calculateus.com — a free calculator platform covering finance, health, math and everyday life.",
};

export default function AboutPage() {
  return (
    <LegalLayout title="About Calculateus" updated="August 5, 2026">
      <p>
        Calculateus.com was built on a simple idea: the internet's calculators are stuck in the past —
        cluttered, slow, and unpleasant to use. We set out to build something different — a fast,
        beautifully designed home for every calculation you need, from a quick tip split to a full
        mortgage amortization schedule.
      </p>
      <h2>What we offer</h2>
      <p>
        Calculateus provides {allCalculators.length}+ free calculators across {categories.length} categories —
        {" "}{categories.map((c) => c.title).join(", ")} — with more added regularly. Every calculator runs
        instantly in your browser: no sign-up, no waiting, no clutter.
      </p>
      <h2>How we build our calculators</h2>
      <p>
        Each calculator is built on established, publicly documented formulas — standard amortization math
        for loans and mortgages, the Mifflin-St Jeor equation for metabolic rate, the U.S. Navy method for
        body fat estimation, and so on. Where a calculation is a simplified estimate rather than a precise
        substitute for professional advice (like our tax or estate calculators), we say so directly on the
        page.
      </p>
      <h2>Our approach to accuracy</h2>
      <ul>
        <li>We use recognized, standard formulas rather than inventing our own.</li>
        <li>We clearly label estimates as estimates, particularly for tax, medical, and legal calculators.</li>
        <li>We fix errors quickly when they're reported — see our <a href="/editorial-policy">Editorial Policy</a>.</li>
      </ul>
      <h2>Get in touch</h2>
      <p>
        Found a bug, have a calculator request, or just want to say hello? Visit our <a href="/contact">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
