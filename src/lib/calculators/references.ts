import { CategorySlug } from "./types";

export interface Reference {
  label: string;
  url: string;
}

// Real, authoritative sources per category — shown automatically on every
// calculator page in that category. Intentionally omitted for categories
// (like "everyday") where no single authoritative body applies cleanly;
// forcing a generic citation there would be filler, not a real reference.
export const CATEGORY_REFERENCES: Partial<Record<CategorySlug, Reference[]>> = {
  financial: [
    { label: "Consumer Financial Protection Bureau", url: "https://www.consumerfinance.gov/" },
    { label: "Investor.gov (U.S. Securities and Exchange Commission)", url: "https://www.investor.gov/" },
  ],
  tax: [
    { label: "IRS.gov — Tax brackets and rates", url: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets" },
    { label: "IRS.gov — Tax withholding estimator", url: "https://www.irs.gov/individuals/tax-withholding-estimator" },
  ],
  health: [
    { label: "CDC — Body Mass Index", url: "https://www.cdc.gov/bmi/index.html" },
    { label: "NIH — Dietary Guidelines for Americans", url: "https://www.dietaryguidelines.gov/" },
  ],
  math: [
    { label: "NIST Digital Library of Mathematical Functions", url: "https://dlmf.nist.gov/" },
    { label: "Wolfram MathWorld", url: "https://mathworld.wolfram.com/" },
  ],
  conversion: [
    { label: "NIST — The International System of Units (SI)", url: "https://www.nist.gov/pml/owm/metric-si/si-units" },
  ],
};

export function getReferences(category: CategorySlug): Reference[] {
  return CATEGORY_REFERENCES[category] ?? [];
}
