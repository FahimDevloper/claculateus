import { CalculatorDefinition, ComputeResult, FieldValues } from "@/lib/calculators/types";

function csvEscape(cell: string): string {
  return `"${String(cell).replace(/"/g, '""')}"`;
}

export function resultsToCsv(def: CalculatorDefinition, values: FieldValues, result: ComputeResult): string {
  const rows: string[][] = [["Field", "Value"]];
  for (const f of def.fields) {
    rows.push([f.label, String(values[f.id] ?? "")]);
  }
  rows.push(["", ""]);
  rows.push(["Result", "Value"]);
  for (const item of result.items) {
    rows.push([item.label, item.value]);
  }
  if (result.table) {
    rows.push([""]);
    rows.push(result.table.headers);
    for (const row of result.table.rows) rows.push(row.map(String));
  }
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}

export function downloadText(filename: string, content: string, mime = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function valuesToSearchParams(values: FieldValues): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    params.set(key, String(value));
  }
  return params;
}

export function searchParamsToValues(def: CalculatorDefinition, params: URLSearchParams): FieldValues | null {
  if ([...params.keys()].length === 0) return null;
  const values: FieldValues = {};
  let found = false;
  for (const f of def.fields) {
    const raw = params.get(f.id);
    if (raw === null) continue;
    found = true;
    if (f.type === "number") {
      const n = Number(raw);
      values[f.id] = isNaN(n) ? 0 : n;
    } else if (f.type === "checkbox") {
      values[f.id] = raw === "true";
    } else {
      values[f.id] = raw;
    }
  }
  return found ? values : null;
}
