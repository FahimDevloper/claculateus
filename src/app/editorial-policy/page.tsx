import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "How Calculateus.com researches, builds, and maintains its calculators.",
};

export default function EditorialPolicyPage() {
  return (
    <LegalLayout title="Editorial Policy" updated="August 5, 2026">
      <p>
        This page explains how we research, build, review, and maintain the calculators and content on
        Calculateus.com.
      </p>
      <h2>How we build calculators</h2>
      <ul>
        <li>Every formula is based on established, publicly documented methods (e.g. standard loan amortization math, the Mifflin-St Jeor BMR equation, the U.S. Navy body fat method).</li>
        <li>We test each calculator against known reference values before publishing.</li>
        <li>Where a topic requires simplification (like our income tax estimator), we state the simplification directly on the page rather than implying precision we don't have.</li>
      </ul>
      <h2>Keeping content current</h2>
      <p>
        Figures that change over time — like tax brackets or contribution limits — are reviewed periodically.
        Each calculator page shows a description of the assumptions it uses so you can judge whether they
        still apply to you.
      </p>
      <h2>Corrections</h2>
      <p>
        If a calculator produces an incorrect result or a page contains an error, we investigate and correct
        it as soon as possible after being notified. We don't hide or backdate corrections.
      </p>
      <h2>Independence</h2>
      <p>
        Our calculators are not sponsored by financial institutions, and calculation logic is never
        influenced by advertisers. Any advertising on this site (e.g. via Google AdSense) is served
        separately from, and does not influence, our editorial or calculator content.
      </p>
      <h2>Report an issue</h2>
      <p>
        See something wrong? <a href="/contact">Contact us</a> with the calculator name and the inputs you
        used.
      </p>
    </LegalLayout>
  );
}
