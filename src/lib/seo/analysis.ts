// Lightweight, dependency-free SEO content analysis - the same checks a tool
// like Yoast SEO runs, computed client-side against plain text/markdown.

export type CheckStatus = "good" | "ok" | "bad";

export interface SeoCheck {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
}

export type ReadabilityGrade =
  | "Very easy"
  | "Easy"
  | "Fairly easy"
  | "Standard"
  | "Fairly difficult"
  | "Difficult"
  | "Very difficult";

export interface SeoAnalysisInput {
  title: string;
  metaDescription: string;
  content: string;
  focusKeyword?: string;
}

export interface SeoAnalysisResult {
  score: number;
  grade: CheckStatus;
  checks: SeoCheck[];
  wordCount: number;
  fleschScore: number;
  readabilityGrade: ReadabilityGrade;
}

function countWords(text: string): number {
  const words = text.trim().match(/[A-Za-z0-9''-]+/g);
  return words ? words.length : 0;
}

function countSentences(text: string): number {
  const sentences = text.trim().match(/[^.!?]+[.!?]+/g);
  return sentences && sentences.length > 0 ? sentences.length : Math.max(1, text.trim() ? 1 : 0);
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  const groups = stripped.match(/[aeiouy]{1,2}/g);
  return groups ? Math.max(1, groups.length) : 1;
}

function fleschReadingEase(text: string): number {
  const words = text.trim().match(/[A-Za-z''-]+/g) ?? [];
  const wordCount = words.length;
  if (wordCount === 0) return 0;
  const sentenceCount = countSentences(text);
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function readabilityGrade(score: number): ReadabilityGrade {
  if (score >= 90) return "Very easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

function hasHeading(content: string, keyword: string): boolean {
  const headingLines = content.split("\n").filter((l) => /^#{1,6}\s/.test(l.trim()));
  return headingLines.some((l) => l.toLowerCase().includes(keyword));
}

export function analyzeSeo({ title, metaDescription, content, focusKeyword }: SeoAnalysisInput): SeoAnalysisResult {
  const checks: SeoCheck[] = [];
  const wordCount = countWords(content);
  const fleschScore = fleschReadingEase(content);
  const grade = readabilityGrade(fleschScore);

  // Title length
  if (title.length === 0) {
    checks.push({ id: "title-length", label: "SEO title", status: "bad", message: "Title is empty." });
  } else if (title.length > 60) {
    checks.push({
      id: "title-length",
      label: "SEO title",
      status: "ok",
      message: `Title is ${title.length} characters - Google truncates around 60.`,
    });
  } else if (title.length < 30) {
    checks.push({
      id: "title-length",
      label: "SEO title",
      status: "ok",
      message: `Title is only ${title.length} characters - room to add more detail.`,
    });
  } else {
    checks.push({ id: "title-length", label: "SEO title", status: "good", message: `${title.length} characters - good length.` });
  }

  // Meta description length
  if (metaDescription.length === 0) {
    checks.push({ id: "meta-length", label: "Meta description", status: "bad", message: "Meta description is empty." });
  } else if (metaDescription.length > 160) {
    checks.push({
      id: "meta-length",
      label: "Meta description",
      status: "ok",
      message: `${metaDescription.length} characters - Google truncates around 160.`,
    });
  } else if (metaDescription.length < 70) {
    checks.push({
      id: "meta-length",
      label: "Meta description",
      status: "ok",
      message: `Only ${metaDescription.length} characters - aim for 120-160.`,
    });
  } else {
    checks.push({ id: "meta-length", label: "Meta description", status: "good", message: `${metaDescription.length} characters - good length.` });
  }

  // Content length
  if (wordCount < 300) {
    checks.push({ id: "content-length", label: "Content length", status: "bad", message: `${wordCount} words - thin content, aim for 800+.` });
  } else if (wordCount < 800) {
    checks.push({ id: "content-length", label: "Content length", status: "ok", message: `${wordCount} words - solid, could reach 800-1,200 for competitive terms.` });
  } else {
    checks.push({ id: "content-length", label: "Content length", status: "good", message: `${wordCount} words - strong depth.` });
  }

  // Readability
  if (fleschScore < 50) {
    checks.push({ id: "readability", label: "Readability", status: "bad", message: `${grade} (score ${fleschScore}) - simplify sentences.` });
  } else if (fleschScore < 60) {
    checks.push({ id: "readability", label: "Readability", status: "ok", message: `${grade} (score ${fleschScore}).` });
  } else {
    checks.push({ id: "readability", label: "Readability", status: "good", message: `${grade} (score ${fleschScore}).` });
  }

  // Focus keyword checks
  if (focusKeyword && focusKeyword.trim().length > 0) {
    const kw = focusKeyword.trim().toLowerCase();
    const titleHas = title.toLowerCase().includes(kw);
    const metaHas = metaDescription.toLowerCase().includes(kw);
    const first100 = content.trim().split(/\s+/).slice(0, 100).join(" ").toLowerCase();
    const introHas = first100.includes(kw);
    const headingHas = hasHeading(content, kw);
    const occurrences = wordCount > 0 ? (content.toLowerCase().split(kw).length - 1) : 0;
    const density = wordCount > 0 ? (occurrences / wordCount) * 100 : 0;

    checks.push({
      id: "kw-title",
      label: "Keyword in title",
      status: titleHas ? "good" : "bad",
      message: titleHas ? "Focus keyword found in the title." : "Focus keyword is missing from the title.",
    });
    checks.push({
      id: "kw-meta",
      label: "Keyword in meta description",
      status: metaHas ? "good" : "ok",
      message: metaHas ? "Focus keyword found in the meta description." : "Consider adding the focus keyword to the meta description.",
    });
    checks.push({
      id: "kw-intro",
      label: "Keyword in opening text",
      status: introHas ? "good" : "ok",
      message: introHas ? "Focus keyword appears in the first 100 words." : "Focus keyword doesn't appear early - readers and Google both weight the opening.",
    });
    checks.push({
      id: "kw-heading",
      label: "Keyword in a subheading",
      status: headingHas ? "good" : "ok",
      message: headingHas ? "Focus keyword found in a subheading." : "Add the focus keyword to at least one subheading.",
    });
    if (density > 3) {
      checks.push({ id: "kw-density", label: "Keyword density", status: "bad", message: `${density.toFixed(1)}% - too dense, reads as keyword stuffing.` });
    } else if (density < 0.3) {
      checks.push({ id: "kw-density", label: "Keyword density", status: "ok", message: `${density.toFixed(1)}% - could use the keyword a bit more.` });
    } else {
      checks.push({ id: "kw-density", label: "Keyword density", status: "good", message: `${density.toFixed(1)}% - healthy range.` });
    }
  }

  const weight: Record<CheckStatus, number> = { good: 1, ok: 0.5, bad: 0 };
  const score = Math.round((checks.reduce((sum, c) => sum + weight[c.status], 0) / checks.length) * 100);
  const overallGrade: CheckStatus = score >= 80 ? "good" : score >= 50 ? "ok" : "bad";

  return { score, grade: overallGrade, checks, wordCount, fleschScore, readabilityGrade: grade };
}
