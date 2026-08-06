"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminEmail } from "@/lib/admin/config";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts/new", label: "New Post" },
  { href: "/admin/calculators", label: "Calculators" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/redirects", label: "Redirects" },
  { href: "/admin/not-found", label: "404 Page" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/ai", label: "AI" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/backup", label: "Backup" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || !isAdminEmail(user.email)) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-bold text-foreground">Not authorized</h1>
        <p className="max-w-sm text-sm text-muted">
          This area is restricted to the site administrator. Sign in with the admin account to continue.
        </p>
        <Link href="/" className="btn-primary mt-2 rounded-lg px-4 py-2 text-sm font-semibold">
          Back to Calculateus
        </Link>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Admin</h1>
        <nav className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  active ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
