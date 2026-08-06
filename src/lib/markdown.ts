import { slugify } from "./slugify";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface RenderedMarkdown {
  html: string;
  headings: Heading[];
  wordCount: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  return !/^\s*javascript:/i.test(trimmed);
}

const YOUTUBE_RE = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/i;
const VIMEO_RE = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/i;

function videoEmbedHtml(line: string): string | null {
  const yt = line.match(YOUTUBE_RE);
  if (yt) {
    return `<div class="my-5 aspect-video overflow-hidden rounded-2xl border border-border"><iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="Embedded video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" class="h-full w-full"></iframe></div>`;
  }
  const vm = line.match(VIMEO_RE);
  if (vm) {
    return `<div class="my-5 aspect-video overflow-hidden rounded-2xl border border-border"><iframe src="https://player.vimeo.com/video/${vm[1]}" title="Embedded video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" class="h-full w-full"></iframe></div>`;
  }
  return null;
}

function processInline(rawText: string): string {
  let text = escapeHtml(rawText);

  // images: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt: string, url: string) => {
    if (!isSafeUrl(url)) return escapeHtml(alt);
    return `<img src="${url}" alt="${alt}" loading="lazy" class="my-4 w-full rounded-2xl border border-border" />`;
  });

  // links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, url: string) => {
    if (!isSafeUrl(url)) return label;
    const external = /^https?:\/\//i.test(url);
    return `<a href="${url}" class="text-primary underline underline-offset-2 hover:text-primary-hover"${
      external ? ' target="_blank" rel="noopener noreferrer"' : ""
    }>${label}</a>`;
  });

  // inline code
  text = text.replace(/`([^`]+)`/g, '<code class="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em]">$1</code>');

  // bold
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // italic
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  text = text.replace(/(?<!_)_([^_]+)_(?!_)/g, "<em>$1</em>");

  return text;
}

export function renderMarkdown(source: string): RenderedMarkdown {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const headings: Heading[] = [];
  const out: string[] = [];

  let i = 0;
  let paragraphBuf: string[] = [];
  let listBuf: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let quoteBuf: string[] = [];

  function flushParagraph() {
    if (paragraphBuf.length) {
      out.push(`<p>${processInline(paragraphBuf.join(" "))}</p>`);
      paragraphBuf = [];
    }
  }
  function flushList() {
    if (listBuf.length && listType) {
      out.push(`<${listType} class="${listType === "ul" ? "list-disc" : "list-decimal"} pl-6 flex flex-col gap-1.5 my-4">${listBuf
        .map((item) => `<li>${processInline(item)}</li>`)
        .join("")}</${listType}>`);
      listBuf = [];
      listType = null;
    }
  }
  function flushQuote() {
    if (quoteBuf.length) {
      out.push(
        `<blockquote class="border-l-4 border-primary pl-4 italic text-muted my-4">${quoteBuf
          .map((l) => `<p>${processInline(l)}</p>`)
          .join("")}</blockquote>`
      );
      quoteBuf = [];
    }
  }
  function flushAll() {
    flushParagraph();
    flushList();
    flushQuote();
  }

  while (i < lines.length) {
    const line = lines[i];

    const soleUrl = line.trim().match(/^https?:\/\/\S+$/);
    if (soleUrl) {
      const embed = videoEmbedHtml(line.trim());
      if (embed) {
        flushAll();
        out.push(embed);
        i++;
        continue;
      }
    }

    const tableHeader = line.match(/^\|(.+)\|\s*$/);
    const tableSep = lines[i + 1]?.match(/^\|[\s:|-]+\|\s*$/);
    if (tableHeader && tableSep) {
      flushAll();
      const headers = tableHeader[1].split("|").map((c) => c.trim());
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && /^\|(.+)\|\s*$/.test(lines[i])) {
        rows.push(lines[i].match(/^\|(.+)\|\s*$/)![1].split("|").map((c) => c.trim()));
        i++;
      }
      out.push(
        `<div class="my-4 overflow-x-auto"><table class="w-full border-collapse text-sm"><thead><tr>${headers
          .map((h) => `<th class="border-b-2 border-border px-3 py-2 text-left font-semibold text-foreground">${processInline(h)}</th>`)
          .join("")}</tr></thead><tbody>${rows
          .map(
            (r) =>
              `<tr>${r.map((c) => `<td class="border-b border-border/60 px-3 py-2">${processInline(c)}</td>`).join("")}</tr>`
          )
          .join("")}</tbody></table></div>`
      );
      continue;
    }

    const fence = line.match(/^```(\w*)/);
    if (fence) {
      flushAll();
      const lang = fence[1];
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      out.push(
        `<pre class="overflow-x-auto rounded-xl bg-surface-2 border border-border p-4 my-4 text-sm"><code${
          lang ? ` class="language-${lang}"` : ""
        }>${escapeHtml(codeLines.join("\n"))}</code></pre>`
      );
      i++; // skip closing fence
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text);
      if (level === 2 || level === 3) headings.push({ id, text, level });
      out.push(`<h${level} id="${id}">${processInline(text)}</h${level}>`);
      i++;
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      flushList();
      quoteBuf.push(quote[1]);
      i++;
      continue;
    }

    const ulItem = line.match(/^[-*+]\s+(.*)$/);
    if (ulItem) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listBuf.push(ulItem[1]);
      i++;
      continue;
    }

    const olItem = line.match(/^\d+\.\s+(.*)$/);
    if (olItem) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listBuf.push(olItem[1]);
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushAll();
      out.push('<hr class="my-6 border-border" />');
      i++;
      continue;
    }

    if (line.trim() === "") {
      flushAll();
      i++;
      continue;
    }

    paragraphBuf.push(line.trim());
    i++;
  }
  flushAll();

  const wordCount = source.trim().split(/\s+/).filter(Boolean).length;

  return { html: out.join("\n"), headings, wordCount };
}
