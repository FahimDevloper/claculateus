import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Calculateus.com's commitment to digital accessibility.",
};

export default function AccessibilityPage() {
  return (
    <LegalLayout title="Accessibility Statement" updated="August 5, 2026">
      <p>
        Calculateus.com is committed to making our calculators usable by everyone, including people with
        disabilities.
      </p>
      <h2>What we do</h2>
      <ul>
        <li>Semantic HTML and labeled form fields so screen readers can navigate calculators.</li>
        <li>Sufficient color contrast in both light and dark themes.</li>
        <li>Full keyboard operability for navigation, search, and calculator inputs.</li>
        <li>Respect for the "reduce motion" operating system setting to minimize animation for users who prefer it.</li>
      </ul>
      <h2>Ongoing work</h2>
      <p>
        Accessibility is an ongoing effort, not a one-time fix. We continue to test and refine the site
        against WCAG 2.1 AA guidelines as we build new features.
      </p>
      <h2>Let us know</h2>
      <p>
        If you encounter an accessibility barrier anywhere on Calculateus.com, please tell us — include the
        page URL and a description of the issue — at{" "}
        <a href="mailto:mdfahimhasan894@gmail.com">mdfahimhasan894@gmail.com</a>. We'll work to address it
        promptly.
      </p>
    </LegalLayout>
  );
}
