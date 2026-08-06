import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Calculateus.com team — report a bug, request a calculator, or ask a question.",
};

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us" updated="August 5, 2026">
      <p>
        We'd love to hear from you — whether it's a bug report, a calculator you'd like us to build, a
        correction to an existing formula, or general feedback.
      </p>
      <h2>Email</h2>
      <p>
        Reach us at <a href="mailto:mdfahimhasan894@gmail.com">mdfahimhasan894@gmail.com</a>. We aim to
        respond within a few business days.
      </p>
      <h2>Reporting a calculation error</h2>
      <p>
        If you believe a calculator is producing an incorrect result, please include the calculator name,
        the exact inputs you used, and the result you expected — this helps us verify and fix issues quickly.
      </p>
      <h2>Business & partnership inquiries</h2>
      <p>
        For advertising, partnership, or licensing inquiries, please use the same email address above with
        the subject line "Business Inquiry."
      </p>
    </LegalLayout>
  );
}
