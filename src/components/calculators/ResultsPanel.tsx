"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CalculatorDefinition, ComputeResult, FieldValues } from "@/lib/calculators/types";
import ExportActions from "./ExportActions";
import ResultChart from "@/components/charts/ResultChart";

interface Props {
  result: ComputeResult;
  def?: CalculatorDefinition;
  values?: FieldValues;
}

export default function ResultsPanel({ result, def, values }: Props) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <div className="glass sticky top-20 overflow-hidden rounded-2xl print:static print:shadow-none">
      <div className="border-b border-border/60 bg-[color-mix(in_oklab,var(--surface-2)_70%,transparent)] px-5 py-3">
        <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Result</h2>
      </div>
      <div className="p-5">
        {result.error ? (
          <p className="text-sm text-danger">{result.error}</p>
        ) : result.items.length === 0 ? (
          <p className="text-sm text-muted">Enter values to see your result.</p>
        ) : (
          <dl className="flex flex-col gap-3">
            {result.items.map((item, i) => (
              <div
                key={i}
                className={
                  item.emphasis
                    ? "overflow-hidden rounded-xl bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] p-4"
                    : "flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                }
              >
                {item.emphasis ? (
                  <>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">{item.label}</dt>
                    <motion.dd
                      key={item.value}
                      initial={isFirstRender.current ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className="mt-1 text-2xl font-bold text-primary sm:text-3xl"
                    >
                      {item.value}
                    </motion.dd>
                  </>
                ) : (
                  <>
                    <dt className="text-sm text-muted">{item.label}</dt>
                    <dd className="text-sm font-semibold text-foreground">{item.value}</dd>
                  </>
                )}
                {item.help && <p className="text-xs text-muted">{item.help}</p>}
              </div>
            ))}
          </dl>
        )}
        {result.note && <p className="mt-4 text-xs text-muted">{result.note}</p>}
      </div>
      {result.chart && <ResultChart chart={result.chart} />}
      {result.table && (
        <div className="scrollbar-thin max-h-80 overflow-auto border-t border-border/60">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-surface-2">
              <tr>
                {result.table.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-semibold text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.table.rows.map((row, i) => (
                <tr key={i} className="border-t border-border/60">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5 text-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {def && values && !result.error && result.items.length > 0 && (
        <ExportActions def={def} values={values} result={result} />
      )}
    </div>
  );
}
