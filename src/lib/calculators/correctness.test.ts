import { describe, it, expect } from "vitest";
import { getCalculator } from "./registry";
import type { FieldValues } from "./types";

/** Pulls a result item's numeric value by label, stripping currency/percent formatting. */
function numFrom(items: { label: string; value: string }[], label: string): number {
  const item = items.find((i) => i.label === label);
  if (!item) throw new Error(`No result item labeled "${label}" (available: ${items.map((i) => i.label).join(", ")})`);
  const cleaned = item.value.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned);
}

function compute(slug: string, values: FieldValues) {
  const def = getCalculator(slug);
  if (!def) throw new Error(`No calculator registered for slug "${slug}"`);
  return def.compute(values);
}

describe("bmi", () => {
  it("5'8\" / 160lb -> BMI ~24.3, Normal weight", () => {
    const result = compute("bmi", { units: "imperial", weight: 160, height: 68 });
    expect(numFrom(result.items, "Your BMI")).toBeCloseTo(24.3, 1);
    expect(result.items.find((i) => i.label === "Category")?.value).toBe("Normal weight");
  });

  it("metric input gives the same result as the equivalent imperial input", () => {
    const imperial = compute("bmi", { units: "imperial", weight: 160, height: 68 });
    const metric = compute("bmi", { units: "metric", weight: 72.5748, height: 172.72 });
    expect(numFrom(imperial.items, "Your BMI")).toBeCloseTo(numFrom(metric.items, "Your BMI"), 1);
  });

  it("categorizes a high BMI as Obese", () => {
    const result = compute("bmi", { units: "imperial", weight: 250, height: 66 });
    expect(result.items.find((i) => i.label === "Category")?.value).toBe("Obese");
  });
});

describe("percentage", () => {
  it("20% of 80 = 16", () => {
    const result = compute("percentage", { mode: "of", x: 20, y: 80 });
    const value = numFrom(result.items, result.items[0].label);
    expect(value).toBeCloseTo(16, 6);
  });
});

describe("tip", () => {
  it("$85 bill at 18% tip -> $15.30 tip, $100.30 total", () => {
    const result = compute("tip", { bill: 85, tipPercent: 18, people: 1 });
    expect(numFrom(result.items, "Tip Amount")).toBeCloseTo(15.3, 1);
    expect(numFrom(result.items, "Total Bill")).toBeCloseTo(100.3, 1);
  });

  it("splitting $100.30 four ways gives $25.08 per person", () => {
    const result = compute("tip", { bill: 85, tipPercent: 18, people: 4 });
    expect(numFrom(result.items, "Total Per Person")).toBeCloseTo(25.08, 1);
  });
});

describe("quadratic", () => {
  it("x^2 - 3x + 2 = 0 has real roots 2 and 1", () => {
    const result = compute("quadratic", { a: 1, b: -3, c: 2 });
    const text = result.items.map((i) => i.value).join(" ");
    expect(text).toMatch(/\b2\b/);
    expect(text).toMatch(/\b1\b/);
  });

  it("a discriminant of exactly zero gives one repeated root", () => {
    // x^2 - 4x + 4 = 0 -> (x-2)^2 = 0 -> single root at x=2
    const result = compute("quadratic", { a: 1, b: -4, c: 4 });
    const text = result.items.map((i) => `${i.label}: ${i.value}`).join(" | ");
    expect(text).toContain("2");
  });
});

describe("1099-tax (self-employment tax)", () => {
  it("$80,000 net SE income produces roughly $11,304 in SE tax", () => {
    const result = compute("1099-tax", { netIncome: 80000, filingStatus: "single" });
    const seTaxItem = result.items.find((i) => /self.employment tax/i.test(i.label));
    expect(seTaxItem).toBeDefined();
    if (seTaxItem) {
      const value = parseFloat(seTaxItem.value.replace(/[^0-9.-]/g, ""));
      expect(value).toBeCloseTo(11304, -2);
    }
  });
});
