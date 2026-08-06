import Link from "next/link";
import { getNotFoundSettings } from "@/lib/admin/notFoundSettings";

export default async function NotFound() {
  const settings = await getNotFoundSettings();

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="text-sm font-bold uppercase tracking-widest text-primary">404</span>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{settings.heading}</h1>
      <p className="max-w-md text-muted">{settings.message}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold">
          Back to homepage
        </Link>
      </div>
      {settings.suggestedLinks.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {settings.suggestedLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
