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

const siteUrl = "https://www.calculateus.com";

export const metadata: Metadata = {
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
};

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
      <head>
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
        {integrations.gscVerification && <meta name="google-site-verification" content={integrations.gscVerification} />}
        {integrations.bingVerification && <meta name="msvalidate.01" content={integrations.bingVerification} />}
        {integrations.pinterestVerification && <meta name="p:domain_verify" content={integrations.pinterestVerification} />}
        {integrations.adsensePublisherId && <meta name="google-adsense-account" content={integrations.adsensePublisherId} />}
        {integrations.adsensePublisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${integrations.adsensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
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
        {integrations.gaMeasurementId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${integrations.gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${integrations.gaMeasurementId}');`}
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
