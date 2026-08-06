"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalculatorDefinition, FieldValues } from "@/lib/calculators/types";
import ResultChart from "@/components/charts/ResultChart";

const STEPS = [-30, -20, -10, 0, 10, 20, 30];

function parseEmphasisNumber(raw: string): number | null {
  const m = raw.trim().match(/^-?\$?([\d,]+(?:\.\d+)?)\s*[a-zA-Z%/]*$/);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function formatFieldValue(value: number, unit?: string): string {
  if (unit === "$") return `$${Math.round(value).toLocaleString("en-US")}`;
  const rounded = Math.round(value * 100) / 100;
  return unit ? `${rounded}${unit.length <= 2 ? unit : ` ${unit}`}` : `${rounded}`;
}

interface Props {
  def: CalculatorDefinition;
  values: FieldValues;
}

export default function SensitivityAnalysis({ def, values }: Props) {
  const numericFields = useMemo(
    () => def.fields.filter((f) => f.type === "number" && Number(values[f.id]) !== 0),
    [def, values]
  );
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const activeField = numericFields.find((f) => f.id === fieldId) ?? numericFields[0];

  const analysis = useMemo(() => {
    if (!activeField) return null;
    const base = Number(values[activeField.id]);
    if (!base) return null;

    let emphasisLabel: string | null = null;
    const points: { fieldValue: number; resultValue: number }[] = [];

    for (const pct of STEPS) {
      let variedValue = base * (1 + pct / 100);
      if (activeField.min !== undefined) variedValue = Math.max(activeField.min, variedValue);
      if (activeField.max !== undefined) variedValue = Math.min(activeField.max, variedValue);
      try {
        const testResult = def.compute({ ...values, [activeField.id]: variedValue });
        if (testResult.error) continue;
        const emphasisItem = testResult.items.find((i) => i.emphasis);
        if (!emphasisItem) continue;
        const num = parseEmphasisNumber(emphasisItem.value);
        if (num === null) continue;
        emphasisLabel = emphasisItem.label;
        points.push({ fieldValue: variedValue, resultValue: num });
      } catch {
        continue;
      }
    }

    if (points.length < 4 || !emphasisLabel) return null;
    return { emphasisLabel, points };
  }, [activeField, def, values]);

  if (numericFields.length === 0 || !analysis || !activeField) return null;

  return (
    <div className="card-lg mt-6 overflow-hidden print:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <h2 className="text-sm font-bold text-foreground">Sensitivity analysis</h2>
          <p className="text-xs text-muted">See how {analysis.emphasisLabel.toLowerCase()} changes as an input moves.</p>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0 text-muted" aria-hidden="true">
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60"
          >
            <div className="p-5">
              {numericFields.length > 1 && (
                <label className="mb-4 flex flex-col gap-1.5 text-xs text-muted">
                  Vary
                  <select
                    value={activeField.id}
                    onChange={(e) => setFieldId(e.target.value)}
                    className="field-input max-w-xs"
                  >
                    {numericFields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <ResultChart
                chart={{
                  type: "line",
                  labels: analysis.points.map((p) => formatFieldValue(p.fieldValue, activeField.unit)),
                  series: [{ name: analysis.emphasisLabel, data: analysis.points.map((p) => p.resultValue), color: "primary" }],
                }}
              />
              <p className="mt-3 text-xs text-muted">
                Holding every other input constant, this shows how {analysis.emphasisLabel.toLowerCase()} responds as{" "}
                {activeField.label.toLowerCase()} moves from {formatFieldValue(analysis.points[0].fieldValue, activeField.unit)} to{" "}
                {formatFieldValue(analysis.points[analysis.points.length - 1].fieldValue, activeField.unit)}.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
