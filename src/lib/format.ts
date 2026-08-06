export function formatCurrency(n: number, opts: { decimals?: number } = {}): string {
  if (!isFinite(n)) return "—";
  const decimals = opts.decimals ?? 2;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatNumber(n: number, decimals = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(n: number, decimals = 1): string {
  if (!isFinite(n)) return "—";
  return `${n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatInteger(n: number): string {
  if (!isFinite(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function num(v: number | string | boolean | undefined, fallback = 0): number {
  if (typeof v === "number") return isFinite(v) ? v : fallback;
  if (typeof v === "string") {
    const parsed = parseFloat(v.replace(/,/g, ""));
    return isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function str(v: number | string | boolean | undefined, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return fallback;
}

export function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = Math.round(totalMonths % 12);
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  return parts.length ? parts.join(" ") : "0 months";
}
