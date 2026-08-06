let counter = 0;
function newId(): string {
  counter += 1;
  return `b${Date.now().toString(36)}${counter}`;
}

export type Block =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading2"; text: string }
  | { id: string; type: "heading3"; text: string }
  | { id: string; type: "bulletList"; items: string[] }
  | { id: string; type: "numberList"; items: string[] }
  | { id: string; type: "quote"; text: string }
  | { id: string; type: "code"; code: string; lang: string }
  | { id: string; type: "image"; url: string; alt: string }
  | { id: string; type: "table"; headers: string[]; rows: string[][] }
  | { id: string; type: "video"; url: string }
  | { id: string; type: "divider" };

export type BlockType = Block["type"];

export const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Text",
  heading2: "Heading",
  heading3: "Subheading",
  bulletList: "Bulleted list",
  numberList: "Numbered list",
  quote: "Quote",
  code: "Code",
  image: "Image",
  table: "Table",
  video: "Video embed",
  divider: "Divider",
};

export function emptyBlock(type: BlockType): Block {
  switch (type) {
    case "paragraph": return { id: newId(), type, text: "" };
    case "heading2": return { id: newId(), type, text: "" };
    case "heading3": return { id: newId(), type, text: "" };
    case "bulletList": return { id: newId(), type, items: [""] };
    case "numberList": return { id: newId(), type, items: [""] };
    case "quote": return { id: newId(), type, text: "" };
    case "code": return { id: newId(), type, code: "", lang: "" };
    case "image": return { id: newId(), type, url: "", alt: "" };
    case "table": return { id: newId(), type, headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "video": return { id: newId(), type, url: "" };
    case "divider": return { id: newId(), type };
  }
}

const YOUTUBE_RE = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/i;
const VIMEO_RE = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/i;

/** Reverse of blocksToMarkdown — parses an existing post's markdown into editable blocks. */
export function markdownToBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  let paraBuf: string[] = [];

  function flushParagraph() {
    if (paraBuf.length === 0) return;
    const text = paraBuf.join("\n").trim();
    paraBuf = [];
    if (!text) return;
    const imgOnly = text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgOnly) {
      blocks.push({ id: newId(), type: "image", alt: imgOnly[1], url: imgOnly[2] });
      return;
    }
    blocks.push({ id: newId(), type: "paragraph", text });
  }

  while (i < lines.length) {
    const line = lines[i];

    const soleUrl = line.trim().match(/^https?:\/\/\S+$/);
    if (soleUrl && (YOUTUBE_RE.test(line.trim()) || VIMEO_RE.test(line.trim()))) {
      flushParagraph();
      blocks.push({ id: newId(), type: "video", url: line.trim() });
      i++;
      continue;
    }

    const fence = line.match(/^```(\w*)/);
    if (fence) {
      flushParagraph();
      const lang = fence[1];
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ id: newId(), type: "code", code: codeLines.join("\n"), lang });
      i++;
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ id: newId(), type: heading[1].length === 2 ? "heading2" : "heading3", text: heading[2].trim() });
      i++;
      continue;
    }
    const h1 = line.match(/^#\s+(.*)$/);
    if (h1) {
      flushParagraph();
      blocks.push({ id: newId(), type: "heading2", text: h1[1].trim() });
      i++;
      continue;
    }

    const tableHeader = line.match(/^\|(.+)\|\s*$/);
    const tableSep = lines[i + 1]?.match(/^\|[\s:|-]+\|\s*$/);
    if (tableHeader && tableSep) {
      flushParagraph();
      const headers = tableHeader[1].split("|").map((c) => c.trim());
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && /^\|(.+)\|\s*$/.test(lines[i])) {
        rows.push(lines[i].match(/^\|(.+)\|\s*$/)![1].split("|").map((c) => c.trim()));
        i++;
      }
      blocks.push({ id: newId(), type: "table", headers, rows: rows.length ? rows : [headers.map(() => "")] });
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      const quoteLines = [quote[1]];
      i++;
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ id: newId(), type: "quote", text: quoteLines.join("\n") });
      continue;
    }

    const ulItem = line.match(/^[-*+]\s+(.*)$/);
    if (ulItem) {
      flushParagraph();
      const items = [ulItem[1]];
      i++;
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ id: newId(), type: "bulletList", items });
      continue;
    }

    const olItem = line.match(/^\d+\.\s+(.*)$/);
    if (olItem) {
      flushParagraph();
      const items = [olItem[1]];
      i++;
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ id: newId(), type: "numberList", items });
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushParagraph();
      blocks.push({ id: newId(), type: "divider" });
      i++;
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      i++;
      continue;
    }

    paraBuf.push(line);
    i++;
  }
  flushParagraph();

  return blocks.length ? blocks : [emptyBlock("paragraph")];
}

/** Serializes edited blocks back to the markdown string used for storage and public rendering. */
export function blocksToMarkdown(blocks: Block[]): string {
  const chunks = blocks.map((b) => {
    switch (b.type) {
      case "paragraph": return b.text;
      case "heading2": return `## ${b.text}`;
      case "heading3": return `### ${b.text}`;
      case "bulletList": return b.items.filter((i) => i.trim()).map((i) => `- ${i}`).join("\n");
      case "numberList": return b.items.filter((i) => i.trim()).map((i, idx) => `${idx + 1}. ${i}`).join("\n");
      case "quote": return b.text.split("\n").map((l) => `> ${l}`).join("\n");
      case "code": return `\`\`\`${b.lang}\n${b.code}\n\`\`\``;
      case "image": return `![${b.alt}](${b.url})`;
      case "table": {
        const header = `| ${b.headers.join(" | ")} |`;
        const sep = `| ${b.headers.map(() => "---").join(" | ")} |`;
        const rows = b.rows.map((r) => `| ${r.join(" | ")} |`);
        return [header, sep, ...rows].join("\n");
      }
      case "video": return b.url;
      case "divider": return "---";
    }
  });
  return chunks.filter((c) => c.trim() !== "").join("\n\n");
}
