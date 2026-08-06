import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
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
      </body>
    </html>
  );
}
