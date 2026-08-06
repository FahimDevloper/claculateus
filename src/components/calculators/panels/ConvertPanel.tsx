"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { unitCategories, convertUnit, convertTemperature } from "@/lib/units";
import { formatNumber } from "@/lib/format";

interface Props {
  compact?: boolean;
  onResult?: (expression: string, result: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  length: "Length", weight: "Weight", volume: "Volume", speed: "Speed", area: "Area",
  dataStorage: "Data Storage", pressure: "Pressure", energy: "Energy", power: "Power",
  angle: "Angle", time: "Time", frequency: "Frequency", torque: "Torque",
};

const TEMP_UNITS = [{ value: "c", label: "Celsius (°C)" }, { value: "f", label: "Fahrenheit (°F)" }, { value: "k", label: "Kelvin (K)" }];

export default function ConvertPanel({ compact, onResult }: Props) {
  const [category, setCategory] = useState<string>("length");
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("ft");
  const [to, setTo] = useState("m");

  const isTemp = category === "temperature";
  const units = isTemp ? TEMP_UNITS : unitCategories[category]?.units ?? [];

  useEffect(() => {
    if (isTemp) { setFrom("c"); setTo("f"); }
    else { setFrom(units[0]?.value ?? ""); setTo(units[1]?.value ?? units[0]?.value ?? ""); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const result = isTemp ? convertTemperature(value, from, to) : convertUnit(category, value, from, to);

  function logConversion(v: number, f: string, t: string) {
    const r = isTemp ? convertTemperature(v, f, t) : convertUnit(category, v, f, t);
    onResult?.(`${v} ${f} → ${t}`, formatNumber(r, 4));
  }

  return (
    <div className={`glass mx-auto w-full ${compact ? "max-w-sm" : "max-w-md"} overflow-hidden rounded-3xl`}>
      <div className="border-b border-border/60 px-4 py-2.5">
        <span className="text-xs font-semibold text-muted">Unit Converter</span>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="field-input"
        >
          <option value="temperature">Temperature</option>
          {Object.keys(unitCategories).map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>
          ))}
        </select>

        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onBlur={() => logConversion(value, from, to)}
          onKeyDown={(e) => e.key === "Enter" && logConversion(value, from, to)}
          className="field-input text-lg font-semibold"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={from}
            onChange={(e) => { setFrom(e.target.value); logConversion(value, e.target.value, to); }}
            className="field-input"
          >
            {units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
          <select
            value={to}
            onChange={(e) => { setTo(e.target.value); logConversion(value, from, e.target.value); }}
            className="field-input"
          >
            {units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>

        <div className="mt-1 rounded-2xl bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] p-4 text-center">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">Result</div>
          <motion.div
            key={result}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mt-1 truncate text-3xl font-bold text-accent"
          >
            {formatNumber(result, 4)}
          </motion.div>
        </div>
        <a href="/conversion" className="text-center text-xs font-semibold text-primary hover:underline">
          Browse all converters →
        </a>
      </div>
    </div>
  );
}
