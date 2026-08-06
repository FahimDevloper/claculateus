"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalculatorDefinition, ComputeResult, FieldValues } from "@/lib/calculators/types";
import { getScenarios, saveScenario, removeScenario, ScenarioEntry, SYNC_EVENT, DATA_MERGED_EVENT } from "@/lib/storage";
import { LayersIcon, PlusIcon, TrashIcon } from "@/components/icons";

function formatFieldValue(value: number | string | boolean, unit?: string): string {
  if (typeof value !== "number") return String(value);
  if (unit === "$") return `$${Math.round(value).toLocaleString("en-US")}`;
  const rounded = Math.round(value * 100) / 100;
  return unit ? `${rounded}${unit.length <= 2 ? unit : ` ${unit}`}` : `${rounded}`;
}

interface Props {
  def: CalculatorDefinition;
  values: FieldValues;
  result: ComputeResult;
  onLoad: (values: FieldValues) => void;
}

export default function ScenarioComparison({ def, values, result, onLoad }: Props) {
  const [scenarios, setScenarios] = useState<ScenarioEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    function refresh() {
      setScenarios(getScenarios(def.slug));
    }
    refresh();
    window.addEventListener(SYNC_EVENT, refresh);
    window.addEventListener(DATA_MERGED_EVENT, refresh);
    return () => {
      window.removeEventListener(SYNC_EVENT, refresh);
      window.removeEventListener(DATA_MERGED_EVENT, refresh);
    };
  }, [def.slug]);

  const scenarioResults = useMemo(
    () =>
      scenarios.map((s) => {
        try {
          return { entry: s, result: def.compute(s.values) };
        } catch {
          return { entry: s, result: null as ComputeResult | null };
        }
      }),
    [scenarios, def]
  );

  function handleSave() {
    const trimmed = label.trim() || `Scenario ${scenarios.length + 1}`;
    setScenarios(saveScenario(def.slug, trimmed, values));
    setLabel("");
    setAdding(false);
    setOpen(true);
  }

  function handleRemove(id: string) {
    setScenarios(removeScenario(def.slug, id));
  }

  return (
    <div className="card-lg mt-6 overflow-hidden print:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <LayersIcon className="h-4 w-4 shrink-0 text-primary" />
          <div>
            <h2 className="text-sm font-bold text-foreground">Compare scenarios</h2>
            <p className="text-xs text-muted">
              {scenarios.length > 0
                ? `${scenarios.length} saved scenario${scenarios.length === 1 ? "" : "s"}`
                : "Save this input set and compare it against others"}
            </p>
          </div>
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
              {adding ? (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <input
                    autoFocus
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    placeholder={`Scenario ${scenarios.length + 1}`}
                    className="field-input max-w-[220px]"
                  />
                  <button type="button" onClick={handleSave} className="btn-primary px-3 py-1.5 text-xs">
                    Save
                  </button>
                  <button type="button" onClick={() => setAdding(false)} className="btn-ghost px-3 py-1.5 text-xs">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="btn-ghost mb-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Save current inputs as a scenario
                </button>
              )}

              {scenarios.length === 0 ? (
                <p className="text-sm text-muted">No saved scenarios yet. Save your current inputs, tweak a few numbers, and save again to compare them side by side.</p>
              ) : (
                <div className="scrollbar-thin overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60">
                        <th className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-muted"></th>
                        <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted">Current</th>
                        {scenarioResults.map(({ entry }) => (
                          <th key={entry.id} className="py-2 px-3 text-xs font-semibold text-foreground">
                            <div className="flex items-center gap-2">
                              <span className="truncate">{entry.label}</span>
                              <button
                                type="button"
                                onClick={() => onLoad(entry.values)}
                                title="Load these inputs"
                                className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-primary hover:bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]"
                              >
                                Load
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemove(entry.id)}
                                title="Remove scenario"
                                aria-label={`Remove scenario ${entry.label}`}
                                className="text-muted hover:text-danger"
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.items.map((item, i) => (
                        <tr key={i} className={item.emphasis ? "bg-[color-mix(in_oklab,var(--primary)_8%,transparent)]" : "border-b border-border/60 last:border-b-0"}>
                          <td className={`py-2 pr-3 ${item.emphasis ? "font-bold text-foreground" : "text-muted"}`}>{item.label}</td>
                          <td className={`py-2 px-3 ${item.emphasis ? "font-bold text-primary" : "text-foreground"}`}>{item.value}</td>
                          {scenarioResults.map(({ entry, result: r }) => {
                            const match = r?.items.find((x) => x.label === item.label);
                            return (
                              <td key={entry.id} className={`py-2 px-3 ${item.emphasis ? "font-bold text-primary" : "text-foreground"}`}>
                                {r?.error ? "—" : match ? match.value : "—"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                    {def.fields.length > 0 && (
                      <tfoot>
                        <tr className="border-t-2 border-border">
                          <td colSpan={scenarios.length + 2} className="pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                            Inputs
                          </td>
                        </tr>
                        {def.fields.map((f) => (
                          <tr key={f.id} className="border-b border-border/40 last:border-b-0">
                            <td className="py-1.5 pr-3 text-xs text-muted">{f.label}</td>
                            <td className="py-1.5 px-3 text-xs text-foreground">{formatFieldValue(values[f.id], f.unit)}</td>
                            {scenarioResults.map(({ entry }) => (
                              <td key={entry.id} className="py-1.5 px-3 text-xs text-foreground">
                                {formatFieldValue(entry.values[f.id], f.unit)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
