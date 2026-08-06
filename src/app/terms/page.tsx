import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using Calculateus.com.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="August 5, 2026">
      <p>
        By accessing or using Calculateus.com (the "Service"), you agree to be bound by these Terms of
        Service. If you do not agree, please do not use the Service.
      </p>
      <h2>Use of the Service</h2>
      <p>
        Calculateus is provided free of charge for personal, non-commercial and commercial informational
        use. You may not copy, scrape, redistribute, or resell the Service's content, source code, or
        calculator logic without prior written permission.
      </p>
      <h2>No professional advice</h2>
      <p>
        All calculators on this site produce estimates based on the inputs you provide and standard public
        formulas. They are provided for general informational purposes only and do not constitute financial,
        medical, legal, or tax advice. Always consult a qualified professional before making decisions based
        on these results. See our full <a href="/disclaimer">Disclaimer</a>.
      </p>
      <h2>Accuracy</h2>
      <p>
        While we take care to implement calculators correctly, we do not guarantee that results are free of
        errors. If you find an inaccuracy, please <a href="/contact">let us know</a> so we can correct it.
      </p>
      <h2>Intellectual property</h2>
      <p>
        All calculator formulas as implemented, educational content, interface design, and source code on
        Calculateus.com are protected by copyright. Unauthorized reproduction or redistribution is
        prohibited.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        The Service is provided "as is" without warranties of any kind. To the fullest extent permitted by
        law, Calculateus.com and its operators are not liable for any damages arising from your use of, or
        inability to use, the Service.
      </p>
      <h2>Changes to these terms</h2>
      <p>We may revise these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the revised Terms.</p>
      <h2>Contact</h2>
      <p>
        Questions about these Terms? Email <a href="mailto:mdfahimhasan894@gmail.com">mdfahimhasan894@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
