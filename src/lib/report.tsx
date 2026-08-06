import { renderToStaticMarkup } from "react-dom/server";
import ResultChart from "@/components/charts/ResultChart";
import { CalculatorDefinition, ComputeResult, FieldValues } from "@/lib/calculators/types";

const SITE_NAME = "Calculateus.com";
const REPORT_STYLES = `
  :root {
    --primary: #5538f0;
    --primary-foreground: #ffffff;
    --accent: #0d9c92;
    --accent2: #e0559b;
    --warning: #d97706;
    --danger: #dc2626;
    --success: #16a34a;
    --border: #e2e5f0;
    --muted: #5b6072;
    --foreground: #10111c;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    color: var(--foreground);
    font-size: 13px;
    line-height: 1.5;
    padding: 36px 40px 60px;
  }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand svg { display: block; }
  .brand-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
  .brand-name .us { color: var(--primary); }
  .report-meta { text-align: right; font-size: 11px; color: var(--muted); }
  .masthead { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid var(--foreground); padding-bottom: 16px; margin-bottom: 24px; }
  h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 4px; }
  .subtitle { font-size: 12.5px; color: var(--muted); margin: 0 0 28px; }
  h2 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 800;
    color: var(--muted);
    margin: 28px 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border);
  }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  th, td { text-align: left; padding: 7px 10px; border-bottom: 1px solid var(--border); }
  th { color: var(--muted); font-weight: 700; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .results-table td.value { font-weight: 700; }
  .results-table tr.emphasis td { font-size: 16px; font-weight: 800; color: var(--primary); border-bottom: 2px solid var(--primary); padding-top: 10px; padding-bottom: 10px; }
  .note {
    margin-top: 10px;
    padding: 10px 12px;
    background: #f6f7fb;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 11.5px;
    color: var(--muted);
  }
  .formula {
    font-family: ui-monospace, "SF Mono", "Cascadia Code", monospace;
    font-size: 12px;
    white-space: pre-wrap;
    background: #f6f7fb;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 14px;
  }
  .chart-wrap svg { max-width: 420px; }
  .footer {
    margin-top: 40px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    font-size: 10.5px;
    color: var(--muted);
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
  @page {
    margin: 18mm 16mm 22mm;
  }
  @page {
    @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 9.5px;
      color: #5b6072;
    }
  }
  @media print {
    body { padding: 0 4mm 4mm; }
  }
`;

function formatFieldValue(field: CalculatorDefinition["fields"][number], raw: FieldValues[string]): string {
  if (field.type === "checkbox") return raw ? "Yes" : "No";
  if (field.type === "select" || field.type === "radio") {
    const opt = field.options?.find((o) => o.value === String(raw));
    return opt?.label ?? String(raw ?? "");
  }
  if (field.type === "date") {
    const d = raw ? new Date(String(raw)) : null;
    return d && !isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : String(raw ?? "");
  }
  if (!field.unit) return String(raw ?? "");
  if (field.unit === "$") {
    const n = Number(raw);
    return isNaN(n) ? `$${raw}` : `$${n.toLocaleString("en-US")}`;
  }
  return `${raw ?? ""} ${field.unit}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const LOGO_SVG = `<svg width="26" height="26" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="9" fill="#5538f0" />
  <path d="M11 12h10M11 16h6M11 20h10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  <circle cx="23" cy="20" r="2" fill="#0d9c92" stroke="none" />
</svg>`;

export function buildReportHtml(def: CalculatorDefinition, values: FieldValues, result: ComputeResult, formula?: string): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const inputRows = def.fields
    .filter((f) => values[f.id] !== undefined && values[f.id] !== "")
    .map((f) => `<tr><td>${escapeHtml(f.label)}</td><td class="num">${escapeHtml(formatFieldValue(f, values[f.id]))}</td></tr>`)
    .join("");

  const resultRows = result.items
    .map((i) => `<tr class="${i.emphasis ? "emphasis" : ""}"><td>${escapeHtml(i.label)}</td><td class="value num">${escapeHtml(i.value)}</td></tr>`)
    .join("");

  const chartHtml = result.chart ? renderToStaticMarkup(<ResultChart chart={result.chart} />) : "";

  const tableHtml = result.table
    ? `<table>
        <thead><tr>${result.table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
        <tbody>${result.table.rows
          .map((row) => `<tr>${row.map((cell) => `<td class="num">${escapeHtml(String(cell))}</td>`).join("")}</tr>`)
          .join("")}</tbody>
      </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(def.title)} — ${SITE_NAME} Report</title>
<style>${REPORT_STYLES}</style>
</head>
<body>
  <div class="masthead">
    <div class="brand">
      ${LOGO_SVG}
      <span class="brand-name">Calculate<span class="us">us</span></span>
    </div>
    <div class="report-meta">
      calculateus.com/calculators/${def.slug}<br />
      Generated ${today}
    </div>
  </div>

  <h1>${escapeHtml(def.title)}</h1>
  <p class="subtitle">${escapeHtml(def.description)}</p>

  ${inputRows ? `<h2>Your inputs</h2><table>${inputRows}</table>` : ""}

  <h2>Results</h2>
  <table class="results-table">${resultRows}</table>
  ${result.note ? `<div class="note">${escapeHtml(result.note)}</div>` : ""}

  ${tableHtml ? `<h2>Detailed breakdown</h2>${tableHtml}` : ""}

  ${chartHtml ? `<h2>Chart</h2><div class="chart-wrap">${chartHtml}</div>` : ""}

  ${formula ? `<h2>Formula</h2><div class="formula">${escapeHtml(formula)}</div>` : ""}

  <div class="footer">
    <span>© ${new Date().getFullYear()} ${SITE_NAME}. All Rights Reserved. Estimates only — not financial, medical, or legal advice.</span>
    <span>${SITE_NAME}</span>
  </div>
</body>
</html>`;
}

export function openCalculatorReport(def: CalculatorDefinition, values: FieldValues, result: ComputeResult, formula?: string): void {
  const html = buildReportHtml(def, values, result, formula);
  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  // Give the new document a moment to finish laying out (fonts, SVG) before invoking print.
  win.setTimeout(() => win.print(), 250);
}
