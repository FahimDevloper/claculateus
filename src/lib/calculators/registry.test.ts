import { describe, it, expect } from "vitest";
import { allCalculators } from "./registry";
import type { FieldValues } from "./types";

function defaultValues(fields: { id: string; defaultValue?: number | string | boolean; type: string; options?: { value: string }[] }[]): FieldValues {
  const values: FieldValues = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) values[f.id] = f.defaultValue;
    else if (f.type === "number") values[f.id] = 0;
    else if (f.type === "select" && f.options?.length) values[f.id] = f.options[0].value;
    else values[f.id] = "";
  }
  return values;
}

describe("calculator registry", () => {
  it("has no duplicate slugs", () => {
    const slugs = allCalculators.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has exactly 220 calculators", () => {
    expect(allCalculators.length).toBe(220);
  });

  for (const def of allCalculators) {
    it(`${def.slug}: compute() runs on default values without throwing`, () => {
      const values = defaultValues(def.fields);
      const result = def.compute(values);
      expect(result).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    if (def.presets) {
      for (const preset of def.presets) {
        it(`${def.slug}: preset "${preset.label}" runs without throwing`, () => {
          const values = { ...defaultValues(def.fields), ...preset.values } as FieldValues;
          const result = def.compute(values);
          expect(result).toBeDefined();
          expect(Array.isArray(result.items)).toBe(true);
        });
      }
    }

    it(`${def.slug}: result items have no NaN or non-finite numeric-looking values`, () => {
      const values = defaultValues(def.fields);
      const result = def.compute(values);
      for (const item of result.items) {
        expect(item.value).not.toMatch(/NaN|Infinity|undefined/);
      }
    });
  }
});
