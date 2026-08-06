import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Calculateus.com handles your data, cookies, and privacy.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 5, 2026">
      <p>
        This Privacy Policy explains what information Calculateus.com ("we," "us") collects, how it's used,
        and the choices you have. Calculateus fully works without an account — signing in is optional and
        only needed if you want your favorites and calculation history to follow you across devices.
      </p>
      <h2>Information stored in your browser</h2>
      <p>
        Whether or not you sign in, Calculateus uses your browser's local storage to remember things like
        your light/dark theme preference, recent calculation history, favorites, and recently viewed
        calculators. This data stays on your device and is never transmitted to us unless you create an
        account, as described below. You can clear it at any time by clearing your browser's site data.
      </p>
      <h2>Optional accounts & cloud sync</h2>
      <p>
        If you choose to sign in (via email/password or Google, using Firebase Authentication), we store
        your favorites, calculation history, and recently viewed calculators in a private cloud database
        (Google Firebase / Firestore) tied to your account, so this data can sync across your devices. We do
        not store the individual numbers you type into a calculator — only the labels and results you've
        chosen to save, plus your account email and display name.
      </p>
      <p>
        This data is private to your account: our security rules only allow your signed-in account to read
        or write it. You can permanently delete your account and all associated synced data at any time from
        the account menu in the top navigation bar.
      </p>
      <h2>Analytics</h2>
      <p>
        We use Google Analytics for Firebase to understand aggregate traffic patterns — for example, which
        calculators are most used and which pages have errors — so we can improve the site. This data is
        aggregated and is not used to identify you individually.
      </p>
      <h2>Advertising</h2>
      <p>
        Calculateus is free to use and may be supported by advertising, including Google AdSense. Google and
        its partners may use cookies to serve ads based on your prior visits to this or other websites. You
        can opt out of personalized advertising by visiting{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>
        . See our <a href="/cookies">Cookie Policy</a> for more detail.
      </p>
      <h2>Third-party links</h2>
      <p>
        Some pages may link to third-party resources for further reading. We are not responsible for the
        privacy practices of external sites.
      </p>
      <h2>Children's privacy</h2>
      <p>Calculateus is not directed at children under 13, and we do not knowingly collect personal information from children.</p>
      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. Material changes will be reflected by updating the date at the top of this page.</p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Email <a href="mailto:mdfahimhasan894@gmail.com">mdfahimhasan894@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
