import { SeoContent } from "./types";
import { financialContent } from "./financial";
import { taxContent } from "./tax";
import { healthContent } from "./health";
import { mathContent } from "./math";
import { everydayContent } from "./everyday";
import { conversionContent } from "./conversion";

const allSeoContent: Record<string, SeoContent> = {
  ...financialContent,
  ...taxContent,
  ...healthContent,
  ...mathContent,
  ...everydayContent,
  ...conversionContent,
};

export function getSeoContent(slug: string): SeoContent | undefined {
  return allSeoContent[slug];
}

export type { SeoContent };
