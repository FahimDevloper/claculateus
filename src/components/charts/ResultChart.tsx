"use client";

import { useId } from "react";
import { ChartSpec } from "@/lib/calculators/types";

const COLOR_VARS: Record<string, string> = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  accent2: "var(--accent2)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  success: "var(--success)",
};
const PALETTE = ["primary", "accent", "accent2", "warning", "danger", "success"];

function colorFor(name: string | undefined, index: number): string {
  return COLOR_VARS[name ?? PALETTE[index % PALETTE.length]] ?? COLOR_VARS.primary;
}

function formatShort(n: number, prefix = ""): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${prefix}${(n / 1_000).toFixed(0)}K`;
  return `${prefix}${n.toFixed(0)}`;
}

const WIDTH = 600;
const HEIGHT = 280;
const PAD = { top: 16, right: 16, bottom: 32, left: 48 };

function LineOrBar({ spec, type }: { spec: ChartSpec; type: "line" | "bar" }) {
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const maxVal = Math.max(1, ...spec.series.flatMap((s) => s.data));
  const n = spec.labels.length;
  const xStep = n > 1 ? innerW / (n - 1) : innerW;
  const yScale = (v: number) => innerH - (v / maxVal) * innerH;
  const gridLines = 4;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Chart">
      <g transform={`translate(${PAD.left},${PAD.top})`}>
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = (innerH / gridLines) * i;
          const val = maxVal - (maxVal / gridLines) * i;
          return (
            <g key={i}>
              <line x1={0} x2={innerW} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} />
              <text x={-8} y={y + 4} textAnchor="end" fontSize={10} fill="var(--muted)">
                {formatShort(val, spec.valuePrefix)}
              </text>
            </g>
          );
        })}

        {type === "bar"
          ? spec.series.map((s, si) => {
              const barGroupWidth = innerW / n;
              const barWidth = (barGroupWidth * 0.6) / spec.series.length;
              return s.data.map((v, i) => {
                const x = i * barGroupWidth + barGroupWidth * 0.2 + si * barWidth;
                const y = yScale(v);
                return (
                  <rect
                    key={`${si}-${i}`}
                    x={x}
                    y={y}
                    width={Math.max(barWidth - 2, 1)}
                    height={innerH - y}
                    fill={colorFor(s.color, si)}
                    rx={2}
                  >
                    <title>{`${s.name}: ${formatShort(v, spec.valuePrefix)}`}</title>
                  </rect>
                );
              });
            })
          : spec.series.map((s, si) => {
              const points = s.data.map((v, i) => `${i * xStep},${yScale(v)}`).join(" ");
              return (
                <g key={si}>
                  <polyline points={points} fill="none" stroke={colorFor(s.color, si)} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                  {s.data.map((v, i) => (
                    <circle key={i} cx={i * xStep} cy={yScale(v)} r={3} fill={colorFor(s.color, si)}>
                      <title>{`${s.name} — ${spec.labels[i]}: ${formatShort(v, spec.valuePrefix)}`}</title>
                    </circle>
                  ))}
                </g>
              );
            })}

        {spec.labels.map((label, i) => {
          if (n > 8 && i % Math.ceil(n / 8) !== 0) return null;
          return (
            <text key={i} x={type === "bar" ? (i + 0.5) * (innerW / n) : i * xStep} y={innerH + 20} textAnchor="middle" fontSize={10} fill="var(--muted)">
              {label}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function Donut({ spec }: { spec: ChartSpec }) {
  const gradId = useId();
  const data = spec.series[0]?.data ?? [];
  const total = data.reduce((s, v) => s + v, 0) || 1;
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
      <svg width={180} height={180} viewBox="0 0 180 180" role="img" aria-label="Breakdown chart">
        <g id={gradId} />
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        {data.map((v, i) => {
          const frac = v / total;
          const dash = frac * circumference;
          const seg = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={colorFor(undefined, i)}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            >
              <title>{`${spec.labels[i]}: ${formatShort(v, spec.valuePrefix)}`}</title>
            </circle>
          );
          offset += dash;
          return seg;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fill="var(--muted)">
          Total
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">
          {formatShort(total, spec.valuePrefix)}
        </text>
      </svg>
      <ul className="flex flex-col gap-1.5">
        {spec.labels.map((label, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-muted">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colorFor(undefined, i) }} />
            {label} — <span className="font-semibold text-foreground">{formatShort(data[i] ?? 0, spec.valuePrefix)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResultChart({ chart }: { chart: ChartSpec }) {
  return (
    <div className="border-t border-border/60 p-5">
      {chart.series.length > 1 && chart.type !== "donut" && (
        <div className="mb-3 flex flex-wrap gap-3">
          {chart.series.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: colorFor(s.color, i) }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
      {chart.type === "donut" ? <Donut spec={chart} /> : <LineOrBar spec={chart} type={chart.type} />}
    </div>
  );
}
