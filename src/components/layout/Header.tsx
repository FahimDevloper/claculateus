"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/lib/calculators/categories";
import { LogoMark, MenuIcon, XIcon } from "@/components/icons";
import ThemeToggle from "@/components/theme/ThemeToggle";
import CommandPalette from "@/components/search/CommandPalette";
import AccountButton from "@/components/auth/AccountButton";
import type { NavLink } from "@/lib/admin/siteSettings";

export default function Header({ logoUrl, customNavLinks = [] }: { logoUrl?: string; customNavLinks?: NavLink[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_oklab,var(--surface)_78%,transparent)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--surface)_65%,transparent)]">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <motion.div whileHover={{ rotate: -6, scale: 1.06 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logoUrl ? <img src={logoUrl} alt="Calculateus" className="h-7 w-7 rounded-lg object-cover" /> : <LogoMark />}
          </motion.div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Calculate<span className="text-gradient">us</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {categories.map((c) => {
            const active = pathname?.startsWith(`/${c.slug}`);
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                prefetch={false}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {c.title}
              </Link>
            );
          })}
          <Link
            href="/blog"
            className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith("/blog") ? "text-primary" : "text-foreground hover:text-primary"
            }`}
          >
            {pathname?.startsWith("/blog") && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 -z-10 rounded-lg bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            Blog
          </Link>
          {customNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CommandPalette />
          </div>
          <ThemeToggle />
          <AccountButton />
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "x" : "menu"}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {mobileOpen ? <XIcon width={18} height={18} /> : <MenuIcon width={18} height={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <motion.div
              initial="closed"
              animate="open"
              variants={{ open: { transition: { staggerChildren: 0.03 } }, closed: {} }}
              className="container-page flex flex-col gap-1 py-3"
            >
              <div className="mb-1 sm:hidden">
                <CommandPalette />
              </div>
              {categories.map((c) => (
                <motion.div
                  key={c.slug}
                  variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -8 } }}
                >
                  <Link
                    href={`/${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2"
                  >
                    {c.title}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -8 } }}>
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2"
                >
                  Blog
                </Link>
              </motion.div>
              {customNavLinks.map((link) => (
                <motion.div key={link.href} variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -8 } }}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
