import { NextRequest } from "next/server";

const GRADIENTS: Record<string, [string, string]> = {
  financial: ["#5538f0", "#e0559b"],
  tax: ["#5538f0", "#dc2626"],
  health: ["#0d9c92", "#16a34a"],
  math: ["#5538f0", "#0d9c92"],
  everyday: ["#e0559b", "#d97706"],
  conversion: ["#0d9c92", "#5538f0"],
};

const ICONS: Record<string, string> = {
  // house
  financial: "M32 4 4 26h6v26h16V34h12v18h16V26h6L32 4z",
  // receipt
  tax: "M14 2h36v60l-6-4-6 4-6-4-6 4-6-4-6 4V2zm6 14h24M20 26h24M20 36h16",
  // heart
  health: "M32 58S6 40 6 20a14 14 0 0 1 26-8 14 14 0 0 1 26 8c0 20-26 38-26 38z",
  // sigma
  math: "M10 6h44l-18 26 18 26H10l16-26z",
  // checklist / clock
  everyday: "M32 6a26 26 0 1 0 0 52 26 26 0 0 0 0-52zm0 10v16l12 8",
  // exchange arrows
  conversion: "M8 22h40l-10-10M56 42H16l10 10",
};

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function wrapTitle(title: string, maxCharsPerLine: number): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = w;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Calculateus";
  const cat = (searchParams.get("cat") ?? "financial") as keyof typeof GRADIENTS;
  const seed = searchParams.get("seed") ?? title;

  const [c1, c2] = GRADIENTS[cat] ?? GRADIENTS.financial;
  const icon = ICONS[cat] ?? ICONS.financial;
  const h = hashSeed(seed);

  const dots = Array.from({ length: 14 }, (_, i) => {
    const dh = hashSeed(seed + i);
    const cx = 60 + (dh % 1080);
    const cy = 60 + ((dh >> 8) % 510);
    const r = 4 + (dh % 20);
    const op = 0.04 + ((dh >> 4) % 8) / 100;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="${op.toFixed(2)}" />`;
  }).join("");

  // Cards across the site crop this 1200x630 image to very different aspect
  // ratios (a tall narrow mobile card vs. a wide desktop featured banner) via
  // object-cover, which always crops symmetrically from the center. Centered,
  // narrower-than-necessary text survives that far better than left-aligned
  // text anchored near one edge, which routinely lost its first/last words.
  const lines = wrapTitle(title, 20);
  const lineHeight = 62;
  const startY = 630 / 2 - ((lines.length - 1) * lineHeight) / 2 + 18;
  const textSpans = lines
    .map((line, i) => `<tspan x="600" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");

  const iconRotate = h % 12 - 6;

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  ${dots}
  <g transform="translate(900 60) rotate(${iconRotate})" opacity="0.16">
    <path d="${icon}" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" transform="scale(4)" />
  </g>
  <text x="600" y="${startY}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="52" fill="#ffffff">${textSpans}</text>
  <text x="600" y="580" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" fill="#ffffff" opacity="0.85">Calculateus.com</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
