import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RedirectRule {
  from: string;
  to: string;
  permanent: boolean;
}

interface FirestoreValue {
  stringValue?: string;
  booleanValue?: boolean;
}

interface FirestoreDoc {
  fields?: Record<string, FirestoreValue>;
}

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIRESTORE_URL = PROJECT_ID
  ? `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/redirects`
  : null;

let cache: { rules: RedirectRule[]; expiresAt: number } | null = null;

// The Firebase JS SDK isn't compatible with the edge runtime proxy deploys
// to, so this talks to the Firestore REST API directly with plain fetch.
async function loadRedirects(): Promise<RedirectRule[]> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.rules;
  if (!FIRESTORE_URL) return cache?.rules ?? [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(FIRESTORE_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return cache?.rules ?? [];
    const data = (await res.json()) as { documents?: FirestoreDoc[] };
    const rules = (data.documents ?? []).map((d) => ({
      from: d.fields?.from?.stringValue ?? "",
      to: d.fields?.to?.stringValue ?? "",
      permanent: d.fields?.permanent?.booleanValue ?? false,
    }));
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
