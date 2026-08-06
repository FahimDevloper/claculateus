import { CalculatorDefinition } from "./types";
import { getCategory } from "./categories";

/**
 * Most calculator definitions only hand-author 1-2 primary keywords. Rather
 * than hand-writing long-tail variants for 200+ calculators individually
 * (slow, error-prone, and stale the moment a title changes), derive the
 * common long-tail phrasing automatically from the title/category every
 * calculator already has.
 *
 * Titles use a handful of suffixes ("X Calculator", "X Converter", "X
 * Estimator", "X Roller", ...) — only "Calculator" and "Converter" get
 * suffix-aware phrasing ("how to calculate X" / "how to convert X"); every
 * other title falls back to generic-but-still-correct phrasing so we never
 * emit something ungrammatical like "how to calculate length converter".
 */
export function expandKeywords(def: CalculatorDefinition): string[] {
  const title = def.title.trim();
  const shortTitle = (def.shortTitle ?? def.title).trim();
  const categoryTitle = getCategory(def.category)?.title;

  const calcMatch = shortTitle.match(/^(.+?)\s+calculator$/i);
  const bareCalc = calcMatch ? calcMatch[1].trim() : null;

  const converterMatch = shortTitle.match(/^(.+?)\s+converter$/i);
  const bareConverter = converterMatch ? converterMatch[1].trim() : null;

  const derived: (string | null)[] = [
    title,
    shortTitle !== title ? shortTitle : null,
    `free ${shortTitle.toLowerCase()}`,
    `online ${shortTitle.toLowerCase()}`,
    bareCalc ? `how to calculate ${bareCalc.toLowerCase()}` : null,
    bareConverter ? `how to convert ${bareConverter.toLowerCase()}` : null,
    bareConverter ? `${bareConverter.toLowerCase()} conversion` : null,
    categoryTitle ? `${categoryTitle.toLowerCase()} calculator` : null,
  ];

  const seen = new Set<string>();
  const merged: string[] = [];
  for (const k of [...(def.keywords ?? []), ...derived]) {
    if (!k) continue;
    const key = k.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(k);
  }
  return merged.slice(0, 12);
}
