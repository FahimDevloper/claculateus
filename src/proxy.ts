import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRedirects, type RedirectRule } from "@/lib/admin/redirects";

let cache: { rules: RedirectRule[]; expiresAt: number } | null = null;

async function loadRedirects(): Promise<RedirectRule[]> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.rules;
  try {
    const rules = await getRedirects();
    cache = { rules, expiresAt: now + 60_000 };
    return rules;
  } catch {
    return cache?.rules ?? [];
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rules = await loadRedirects();
  const match = rules.find((r) => r.from === pathname);
  if (!match) return NextResponse.next();

  const destination = match.to.startsWith("http") ? match.to : new URL(match.to, request.url).toString();
  return NextResponse.redirect(destination, match.permanent ? 301 : 302);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js|manifest.webmanifest).*)"],
};
