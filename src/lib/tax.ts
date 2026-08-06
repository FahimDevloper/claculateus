// 2025 US federal figures (published IRS Rev. Proc. 2024-40 brackets, simplified for estimation).
export type FilingStatus = "single" | "married";

export const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15000,
  married: 30000,
};

const BRACKETS_2025: Record<FilingStatus, [number, number][]> = {
  single: [
    [11600, 0.1], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37],
  ],
  married: [
    [23200, 0.1], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37],
  ],
};

export interface BracketBreakdown {
  rate: number;
  amountTaxedAtRate: number;
  taxFromBracket: number;
  bracketFloor: number;
  bracketCeiling: number;
}

export function federalTaxBreakdown(taxableIncome: number, status: FilingStatus): { tax: number; marginalRate: number; brackets: BracketBreakdown[] } {
  const brackets = BRACKETS_2025[status];
  let tax = 0;
  let lower = 0;
  let marginalRate = 0;
  const breakdown: BracketBreakdown[] = [];
  for (const [upper, rate] of brackets) {
    if (taxableIncome > lower) {
      const amountTaxedAtRate = Math.min(taxableIncome, upper) - lower;
      const taxFromBracket = amountTaxedAtRate * rate;
      tax += taxFromBracket;
      marginalRate = rate;
      breakdown.push({ rate, amountTaxedAtRate, taxFromBracket, bracketFloor: lower, bracketCeiling: upper });
    }
    lower = upper;
    if (taxableIncome <= upper) break;
  }
  return { tax, marginalRate, brackets: breakdown };
}

export const SOCIAL_SECURITY_RATE = 0.062;
export const SOCIAL_SECURITY_WAGE_BASE_2025 = 176100;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = { single: 200000, married: 250000 };
export const SE_TAX_RATE = 0.153;
export const SE_NET_EARNINGS_FACTOR = 0.9235;
export const SUPPLEMENTAL_WAGE_WITHHOLDING_RATE = 0.22;
export const CORPORATE_TAX_RATE_2025 = 0.21;
export const GIFT_ANNUAL_EXCLUSION_2025 = 19000;
export const ESTATE_LIFETIME_EXEMPTION_2025 = 13990000;

export function ficaTax(wages: number, status: FilingStatus = "single"): { socialSecurity: number; medicare: number; additionalMedicare: number; total: number } {
  const socialSecurity = Math.min(wages, SOCIAL_SECURITY_WAGE_BASE_2025) * SOCIAL_SECURITY_RATE;
  const medicare = wages * MEDICARE_RATE;
  const additionalMedicare = Math.max(wages - ADDITIONAL_MEDICARE_THRESHOLD[status], 0) * ADDITIONAL_MEDICARE_RATE;
  return { socialSecurity, medicare, additionalMedicare, total: socialSecurity + medicare + additionalMedicare };
}

export function longTermCapitalGainsRate(taxableIncomeIncludingGain: number, status: FilingStatus): number {
  const thresholds = status === "married" ? [96700, 600050] : [48350, 533400];
  if (taxableIncomeIncludingGain <= thresholds[0]) return 0;
  if (taxableIncomeIncludingGain <= thresholds[1]) return 0.15;
  return 0.2;
}

// Approximate representative state income tax rates for 2025 (flat estimate; many states are progressive).
export const STATE_TAX_RATES: { code: string; name: string; rate: number }[] = [
  { code: "AL", name: "Alabama", rate: 5 }, { code: "AK", name: "Alaska", rate: 0 }, { code: "AZ", name: "Arizona", rate: 2.5 },
  { code: "AR", name: "Arkansas", rate: 3.9 }, { code: "CA", name: "California", rate: 9.3 }, { code: "CO", name: "Colorado", rate: 4.4 },
  { code: "CT", name: "Connecticut", rate: 5.5 }, { code: "DE", name: "Delaware", rate: 5.5 }, { code: "FL", name: "Florida", rate: 0 },
  { code: "GA", name: "Georgia", rate: 5.39 }, { code: "HI", name: "Hawaii", rate: 8.25 }, { code: "ID", name: "Idaho", rate: 5.8 },
  { code: "IL", name: "Illinois", rate: 4.95 }, { code: "IN", name: "Indiana", rate: 3.05 }, { code: "IA", name: "Iowa", rate: 3.8 },
  { code: "KS", name: "Kansas", rate: 5.2 }, { code: "KY", name: "Kentucky", rate: 4 }, { code: "LA", name: "Louisiana", rate: 4.25 },
  { code: "ME", name: "Maine", rate: 7.15 }, { code: "MD", name: "Maryland", rate: 5.75 }, { code: "MA", name: "Massachusetts", rate: 5 },
  { code: "MI", name: "Michigan", rate: 4.25 }, { code: "MN", name: "Minnesota", rate: 7.85 }, { code: "MS", name: "Mississippi", rate: 4.7 },
  { code: "MO", name: "Missouri", rate: 4.8 }, { code: "MT", name: "Montana", rate: 5.9 }, { code: "NE", name: "Nebraska", rate: 5.2 },
  { code: "NV", name: "Nevada", rate: 0 }, { code: "NH", name: "New Hampshire", rate: 0 }, { code: "NJ", name: "New Jersey", rate: 6.37 },
  { code: "NM", name: "New Mexico", rate: 4.9 }, { code: "NY", name: "New York", rate: 6.85 }, { code: "NC", name: "North Carolina", rate: 4.5 },
  { code: "ND", name: "North Dakota", rate: 2.5 }, { code: "OH", name: "Ohio", rate: 3.5 }, { code: "OK", name: "Oklahoma", rate: 4.75 },
  { code: "OR", name: "Oregon", rate: 9.9 }, { code: "PA", name: "Pennsylvania", rate: 3.07 }, { code: "RI", name: "Rhode Island", rate: 5.99 },
  { code: "SC", name: "South Carolina", rate: 6.4 }, { code: "SD", name: "South Dakota", rate: 0 }, { code: "TN", name: "Tennessee", rate: 0 },
  { code: "TX", name: "Texas", rate: 0 }, { code: "UT", name: "Utah", rate: 4.65 }, { code: "VT", name: "Vermont", rate: 6.6 },
  { code: "VA", name: "Virginia", rate: 5.75 }, { code: "WA", name: "Washington", rate: 0 }, { code: "WV", name: "West Virginia", rate: 4.82 },
  { code: "WI", name: "Wisconsin", rate: 5.3 }, { code: "WY", name: "Wyoming", rate: 0 }, { code: "DC", name: "Washington D.C.", rate: 8.5 },
];
