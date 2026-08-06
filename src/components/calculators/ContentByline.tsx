const LAST_UPDATED = "August 5, 2026";

export default function ContentByline() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
      <span>
        Written &amp; fact-checked by the{" "}
        <a href="/about" className="text-primary hover:underline">
          Calculateus Team
        </a>
      </span>
      <span aria-hidden="true">·</span>
      <span>Last updated {LAST_UPDATED}</span>
      <span aria-hidden="true">·</span>
      <a href="/editorial-policy" className="text-primary hover:underline">
        How we verify our formulas
      </a>
    </div>
  );
}
