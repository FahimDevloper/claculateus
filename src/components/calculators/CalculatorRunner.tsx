"use client";

import { useEffect, useMemo, useState } from "react";
import { CalculatorDefinition, FieldValues } from "@/lib/calculators/types";
import { searchParamsToValues } from "@/lib/exportUtils";
import ResultsPanel from "./ResultsPanel";
import FieldRenderer from "./FieldRenderer";
import SensitivityAnalysis from "./SensitivityAnalysis";
import ScenarioComparison from "./ScenarioComparison";

function initialValues(def: CalculatorDefinition): FieldValues {
  const values: FieldValues = {};
  for (const f of def.fields) {
    if (f.defaultValue !== undefined) values[f.id] = f.defaultValue;
    else if (f.type === "number") values[f.id] = 0;
    else if (f.type === "select" && f.options?.length) values[f.id] = f.options[0].value;
    else values[f.id] = "";
  }
  return values;
}

export default function CalculatorRunner({ def }: { def: CalculatorDefinition }) {
  const [values, setValues] = useState<FieldValues>(() => initialValues(def));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const basicFields = def.fields.filter((f) => !f.advanced);
  const advancedFields = def.fields.filter((f) => f.advanced);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = searchParamsToValues(def, new URLSearchParams(window.location.search));
    if (fromUrl) setValues((prev) => ({ ...prev, ...fromUrl }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.slug]);

  const result = useMemo(() => {
    try {
      return def.compute(values);
    } catch {
      return { items: [], error: "Check your inputs and try again." };
    }
  }, [def, values]);

  function setField(id: string, v: number | string | boolean) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  function reset() {
    setValues(initialValues(def));
    setActivePreset(null);
  }

  function applyPreset(label: string, presetValues: Partial<FieldValues>) {
    setValues((prev) => ({ ...prev, ...presetValues }) as FieldValues);
    setActivePreset(label);
  }

  function loadScenario(scenarioValues: FieldValues) {
    setValues(scenarioValues);
    setActivePreset(null);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="card-lg p-5 sm:p-6 lg:col-span-3 print:border-0 print:shadow-none">
          {def.presets && def.presets.length > 0 && (
            <div className="no-print mb-5 flex flex-wrap gap-2">
              {def.presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.label, p.values)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    activePreset === p.label
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {basicFields.map((f) => (
              <FieldRenderer
                key={f.id}
                field={f}
                value={values[f.id]}
                onChange={(v) => { setField(f.id, v); setActivePreset(null); }}
              />
            ))}
          </div>
          {advancedFields.length > 0 && (
            <div className="no-print mt-5">
              <button
                type="button"
                onClick={() => setShowAdvanced((o) => !o)}
                aria-expanded={showAdvanced}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {showAdvanced ? "Hide advanced options ▴" : "Show advanced options ▾"}
              </button>
              {showAdvanced && (
                <div className="mt-4 grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2 print:border-0">
                  {advancedFields.map((f) => (
                    <FieldRenderer
                      key={f.id}
                      field={f}
                      value={values[f.id]}
                      onChange={(v) => { setField(f.id, v); setActivePreset(null); }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="no-print mt-5 flex gap-3">
            <button type="button" onClick={reset} className="btn-ghost px-4 py-2 text-sm font-medium">
              Reset
            </button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <ResultsPanel result={result} def={def} values={values} />
        </div>
      </div>
      {!result.error && (
        <>
          <SensitivityAnalysis def={def} values={values} />
          <ScenarioComparison def={def} values={values} result={result} onLoad={loadScenario} />
        </>
      )}
    </div>
  );
}
