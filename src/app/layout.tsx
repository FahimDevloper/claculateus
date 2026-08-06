import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import ThemeInit from "@/components/theme/ThemeInit";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/motion/PageTransition";
import { AuthProvider } from "@/contexts/AuthContext";
import SyncEngine from "@/components/auth/SyncEngine";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import ErrorReporter from "@/components/monitoring/ErrorReporter";
import { getSiteSettings } from "@/lib/admin/siteSettings";
import { getIntegrationsSettings } from "@/lib/admin/integrations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://calculateus.com";

// Root layout reads admin-configurable settings (integrations, site
// settings) from Firestore. Without this, Next.js prerenders the layout
// once at build time and those changes never reach the live site.
// 1 hour balances that against TTFB: every page under this layout
// (all 220+ calculators, every blog post) falls out of cache and needs a
// fresh render on the next hit once this window passes, so a shorter
// value means more real visitors and crawlers landing on a slow,
// regenerating page instead of a fast cached one. This is a low-traffic
// site, so a wide window matters more here than it would once regular
// traffic keeps pages continuously warm — admin changes still show up
// within the hour, which is fine for settings that aren't time-critical.
export const revalidate = 3600;

// Async because verification/AdSense meta tags depend on admin-configured integrations.
export async function generateMetadata(): Promise<Metadata> {
  const integrations = await getIntegrationsSettings();

  const verificationOther: Record<string, string> = {};
  if (integrations.bingVerification) verificationOther["msvalidate.01"] = integrations.bingVerification;
  if (integrations.pinterestVerification) verificationOther["p:domain_verify"] = integrations.pinterestVerification;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Calculateus.com — Free Online Calculators for Finance, Health & Math",
      template: "%s | Calculateus.com",
    },
    description:
      "220+ free, fast, accurate online calculators for mortgages, loans, health, fitness, math, and everyday life. No sign-up, no clutter — just answers.",
    keywords: ["calculator", "online calculator", "mortgage calculator", "bmi calculator", "loan calculator", "free calculators"],
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: "Calculateus.com",
      title: "Calculateus.com — Free Online Calculators",
      description: "220+ free, fast, accurate online calculators for finance, health, math and everyday life.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Calculateus.com — Free Online Calculators",
      description: "220+ free, fast, accurate online calculators for finance, health, math and everyday life.",
    },
    icons: {
      icon: "/favicon.svg",
      apple: "/favicon.svg",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Calculateus",
    },
    verification: {
      google: integrations.gscVerification || undefined,
      other: verificationOther,
    },
    other: {
      ...(integrations.adsensePublisherId ? { "google-adsense-account": integrations.adsensePublisherId } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#08090f" },
  ],
  colorScheme: "light dark",
};

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Calculateus.com",
  url: siteUrl,
  logo: `${siteUrl}/favicon.svg`,
  description: "220+ free, fast, accurate online calculators for finance, health, math and everyday life.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Calculateus.com",
  url: siteUrl,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const integrations = await getIntegrationsSettings();
  const accentColor = HEX_COLOR.test(settings.accentColor) ? settings.accentColor : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* No manual <head>: Next owns it via generateMetadata; hand-written <head> script/meta siblings raced its out-of-band mutation and swapped content during hydration. */}
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeInit />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {accentColor && (
          <style
            dangerouslySetInnerHTML={{
              __html: `:root,.dark{--primary:${accentColor};--ring:${accentColor};--primary-hover:color-mix(in oklab, ${accentColor} 85%, black);}`,
            }}
          />
        )}
        {integrations.adsensePublisherId && (
          <Script
            id="adsbygoogle-loader"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${integrations.adsensePublisherId}`}
            strategy="beforeInteractive"
            crossOrigin="anonymous"
          />
        )}
        {integrations.gtmContainerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${integrations.gtmContainerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <SyncEngine />
            <ServiceWorkerRegister />
            <ErrorReporter />
            {settings.maintenanceMode && (
              <div className="bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
                {settings.maintenanceMessage}
              </div>
            )}
            <Header logoUrl={settings.logoUrl} customNavLinks={settings.customNavLinks} />
            <main id="main-content" className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <InstallPrompt />
          </AuthProvider>
        </MotionConfig>
        {integrations.gtmContainerId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${integrations.gtmContainerId}');`}
          </Script>
        )}
        {(integrations.gaMeasurementId || integrations.googleAdsConversionId) && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${integrations.gaMeasurementId || integrations.googleAdsConversionId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${
                integrations.gaMeasurementId ? `gtag('config','${integrations.gaMeasurementId}');` : ""
              }${integrations.googleAdsConversionId ? `gtag('config','${integrations.googleAdsConversionId}');` : ""}`}
            </Script>
          </>
        )}
        {integrations.adsensePublisherId && integrations.adsenseAutoAds && (
          <Script id="adsense-auto-ads" strategy="afterInteractive">
            {`(adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"${integrations.adsensePublisherId}",enable_page_level_ads:true});`}
          </Script>
        )}
      </body>
    </html>
  );
}
