import Link from "next/link";
import { categories } from "@/lib/calculators/categories";
import { getCalculatorsByCategory, allCalculators } from "@/lib/calculators/registry";
import { LogoMark } from "@/components/icons";
import { getSiteSettings } from "@/lib/admin/siteSettings";

const company = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/editorial-policy", label: "Editorial Policy" },
];

const legal = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/security", label: "Security" },
];

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="relative mt-32 border-t border-border bg-surface">
      <div className="container-wide grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt="Calculateus" className="h-7 w-7 rounded-lg object-cover" />
            ) : (
              <LogoMark />
            )}
            <span className="text-lg font-bold tracking-tight text-foreground">
              Calculate<span className="text-gradient">us</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted">{settings.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Always Free", "No Sign-Up", "HTTPS Secured"].map((badge) => (
              <span key={badge} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
                {badge}
              </span>
            ))}
          </div>
          {settings.socialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {settings.socialLinks.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-muted transition-colors hover:text-primary">
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {categories.map((c) => (
          <div key={c.slug}>
            <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {getCalculatorsByCategory(c.slug)
                .slice(0, 6)
                .map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      href={`/calculators/${calc.slug}`}
                      prefetch={false}
                      className="text-sm text-muted transition-colors hover:text-primary"
                    >
                      {calc.shortTitle ?? calc.title}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href={`/${c.slug}`} prefetch={false} className="text-sm font-medium text-primary">
                  View all →
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border py-8">
        <div className="container-wide flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {company.map((l) => (
              <Link key={l.href} href={l.href} prefetch={false} className="text-sm text-muted transition-colors hover:text-primary">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <Link key={l.href} href={l.href} prefetch={false} className="text-sm text-muted transition-colors hover:text-primary">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container-wide flex flex-col gap-2 text-xs leading-relaxed text-muted">
          <p>
            © {new Date().getFullYear()} Calculateus.com. All Rights Reserved. All calculator formulas,
            educational content, interface design and source code are protected by copyright law.
            Unauthorized reproduction or redistribution is prohibited.
          </p>
          <p>
            {allCalculators.length}+ calculators across {categories.length} categories. All calculations are
            estimates for informational purposes only and are not a substitute for professional financial,
            medical, or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
