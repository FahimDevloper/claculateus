"use client";

import { useMemo } from "react";
import { analyzeSeo, CheckStatus } from "@/lib/seo/analysis";

function StatusDot({ status }: { status: CheckStatus }) {
  const color = status === "good" ? "bg-success" : status === "ok" ? "bg-warning" : "bg-danger";
  return <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

function ScoreBadge({ score, grade }: { score: number; grade: CheckStatus }) {
  const styles: Record<CheckStatus, string> = {
    good: "bg-success/10 text-success",
    ok: "bg-warning/10 text-warning",
    bad: "bg-danger/10 text-danger",
  };
  const label: Record<CheckStatus, string> = { good: "Good", ok: "OK", bad: "Needs work" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[grade]}`}>
      {label[grade]} · {score}/100
    </span>
  );
}

export default function SeoAnalysisPanel({
  title,
  metaDescription,
  content,
  url,
  focusKeyword,
  onFocusKeywordChange,
}: {
  title: string;
  metaDescription: string;
  content: string;
  url: string;
  focusKeyword: string;
  onFocusKeywordChange: (value: string) => void;
}) {
  const result = useMemo(
    () => analyzeSeo({ title, metaDescription, content, focusKeyword }),
    [title, metaDescription, content, focusKeyword]
  );

  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">SEO Analysis</h3>
        <ScoreBadge score={result.score} grade={result.grade} />
      </div>

      <label className="flex flex-col gap-1.5 text-xs text-muted">
        Focus keyword
        <input
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          placeholder="e.g. mortgage calculator"
          className="field-input"
        />
      </label>

      <div className="rounded-lg border border-border bg-surface-2 p-3">
        <p className="text-xs font-semibold text-muted">Google preview</p>
        <p className="mt-1.5 truncate text-xs text-foreground">{url}</p>
        <p className="mt-0.5 truncate text-base text-[#1a0dab] dark:text-[#8ab4f8]">{title || "Untitled"}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted">{metaDescription || "No description set."}</p>
      </div>

      <ul className="flex flex-col gap-2">
        {result.checks.map((c) => (
          <li key={c.id} className="flex gap-2 text-sm">
            <StatusDot status={c.status} />
            <span>
              <span className="font-medium text-foreground">{c.label}:</span>{" "}
              <span className="text-muted">{c.message}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
