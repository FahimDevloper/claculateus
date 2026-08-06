import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Security",
  description: "How Calculateus.com protects your data and handles security.",
};

export default function SecurityPage() {
  return (
    <LegalLayout title="Security" updated="August 5, 2026">
      <p>
        We take the security of Calculateus.com and any data you choose to share with it seriously. Here's
        a straightforward look at how things are built.
      </p>
      <h2>Encryption in transit</h2>
      <p>The entire site is served over HTTPS. Your connection to Calculateus.com is encrypted end to end.</p>
      <h2>Authentication</h2>
      <p>
        Sign-in is handled entirely by Google Firebase Authentication — an industry-standard identity
        platform used by millions of apps. We never see or store your password; for email/password
        accounts, Firebase handles hashing and storage, and for Google sign-in, authentication happens
        directly with Google.
      </p>
      <h2>Data access controls</h2>
      <p>
        Your synced favorites, calculation history, and account data are stored in Firestore with security
        rules that restrict access to your own signed-in account only — enforced on the server, not just
        hidden in the interface. Nobody, including us, can read another user's synced data through the app.
      </p>
      <h2>What we don't do</h2>
      <ul>
        <li>We don't store the raw numbers you type into a calculator unless you're signed in and the calculator explicitly saves a result to your history.</li>
        <li>We don't sell personal data.</li>
        <li>We don't ask for financial account credentials, social security numbers, or other sensitive identifiers anywhere on the site.</li>
      </ul>
      <h2>Reporting a security issue</h2>
      <p>
        If you believe you've found a security vulnerability on Calculateus.com, please report it
        responsibly to <a href="mailto:mdfahimhasan894@gmail.com">mdfahimhasan894@gmail.com</a> with
        details to reproduce it. We ask that you give us a reasonable opportunity to fix an issue before
        any public disclosure, and that you avoid accessing or modifying data that isn't yours while
        investigating.
      </p>
      <h2>Related pages</h2>
      <p>
        See also our <a href="/privacy">Privacy Policy</a> for what data we collect and why.
      </p>
    </LegalLayout>
  );
}
