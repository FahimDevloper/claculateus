import { CalculatorDefinition } from "./types";
import { financialCalculators } from "./defs/financial";
import { taxCalculators } from "./defs/tax";
import { healthCalculators } from "./defs/health";
import { mathCalculators } from "./defs/math";
import { everydayCalculators } from "./defs/everyday";
import { conversionCalculators } from "./defs/conversion";

export const allCalculators: CalculatorDefinition[] = [
  ...financialCalculators,
  ...taxCalculators,
  ...healthCalculators,
  ...mathCalculators,
  ...everydayCalculators,
  ...conversionCalculators,
];

const bySlug = new Map(allCalculators.map((c) => [c.slug, c]));

export function getCalculator(slug: string): CalculatorDefinition | undefined {
  return bySlug.get(slug);
}

export function getCalculatorsByCategory(category: string): CalculatorDefinition[] {
  return allCalculators.filter((c) => c.category === category);
}

export function getPopularCalculators(): CalculatorDefinition[] {
  return allCalculators.filter((c) => c.popular);
}
