import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers about the calculators and content on Calculateus.com.",
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" updated="August 5, 2026">
      <p>
        The calculators, tools, and content on Calculateus.com are provided for general informational and
        educational purposes only.
      </p>
      <h2>Not professional advice</h2>
      <p>
        Nothing on this site constitutes financial, investment, tax, legal, or medical advice. Our financial
        calculators (mortgage, loan, retirement, tax estimators, etc.) use simplified, standard formulas and
        do not account for every variable specific to your situation — always consult a licensed financial
        advisor, accountant, or attorney before making financial decisions. Our health calculators (BMI,
        calorie, body fat, etc.) are estimates based on population formulas and are not a substitute for
        advice from a qualified physician or dietitian.
      </p>
      <h2>Accuracy of results</h2>
      <p>
        We aim for our calculators to be accurate and to clearly implement the formulas we describe on each
        page. However, we make no warranty, express or implied, regarding the completeness, reliability, or
        accuracy of any result. Use of any calculator result is at your own risk.
      </p>
      <h2>Tax and legal figures</h2>
      <p>
        Where calculators reference tax brackets, exemption limits, or similar figures, these are based on
        published rates at the time of writing and may become outdated. Always verify current figures with
        an official source (such as the IRS) before relying on them.
      </p>
      <h2>External links</h2>
      <p>We are not responsible for the content or accuracy of external websites we may link to for further reading.</p>
    </LegalLayout>
  );
}
