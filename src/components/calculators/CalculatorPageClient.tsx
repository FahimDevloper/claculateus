"use client";

import { getCalculator } from "@/lib/calculators/registry";
import { customComponents } from "@/lib/calculators/customComponents";
import CalculatorRunner from "./CalculatorRunner";

export default function CalculatorPageClient({ slug }: { slug: string }) {
  const def = getCalculator(slug);
  if (!def) return null;
  const Custom = customComponents[def.slug];
  if (Custom) return <Custom />;
  return <CalculatorRunner def={def} />;
}
