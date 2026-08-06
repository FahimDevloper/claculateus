import { getPublishedPosts } from "@/lib/blog/queries";

const siteUrl = "https://www.calculateus.com";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const revalidate = 300;

export async function GET() {
  const posts = await getPublishedPosts({ max: 50 }).catch(() => []);

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid>${siteUrl}/blog/${p.slug}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <author>${escapeXml(p.authorName)}</author>
      <pubDate>${new Date(p.publishedAt ?? p.createdAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Calculateus Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Guides and articles on personal finance, health, and productivity from Calculateus.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
