import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Calculateus.com uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="August 5, 2026">
      <p>
        This Cookie Policy explains how Calculateus.com uses cookies and similar browser storage
        technologies.
      </p>
      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device by your browser. We also use "local storage," a
        similar browser technology, to save preferences directly on your device.
      </p>
      <h2>How we use them</h2>
      <ul>
        <li><strong>Preferences:</strong> to remember your light/dark theme choice.</li>
        <li><strong>Functionality:</strong> to save calculator history and favorites locally in your browser, where offered.</li>
        <li><strong>Analytics:</strong> to understand aggregate site usage and improve performance.</li>
        <li><strong>Advertising:</strong> Google AdSense and similar partners may set cookies to serve and measure ads, including personalized ads based on your browsing activity.</li>
      </ul>
      <h2>Managing cookies</h2>
      <p>
        Most browsers let you block or delete cookies through their settings. Note that blocking essential
        cookies may affect how parts of the Service function. You can also manage ad personalization directly
        at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about our cookie use? Email <a href="mailto:mdfahimhasan894@gmail.com">mdfahimhasan894@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
