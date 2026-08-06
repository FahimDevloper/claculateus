"use client";

import { useState } from "react";
import { CalculatorDefinition, ComputeResult, FieldValues } from "@/lib/calculators/types";
import { resultsToCsv, downloadText, valuesToSearchParams } from "@/lib/exportUtils";
import { CopyIcon, ShareIcon, DownloadIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";
import { openCalculatorReport } from "@/lib/report";
import { getSeoContent } from "@/lib/calculators/content";

interface Props {
  def: CalculatorDefinition;
  values: FieldValues;
  result: ComputeResult;
}

export default function ExportActions({ def, values, result }: Props) {
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const summary = result.items.map((i) => `${i.label}: ${i.value}`).join("\n");

  async function copyResult() {
    await navigator.clipboard.writeText(`${def.title}\n${summary}`);
    setCopiedResult(true);
    trackEvent("copy_result", { calculator_slug: def.slug });
    setTimeout(() => setCopiedResult(false), 1500);
  }

  async function copyLink() {
    const params = valuesToSearchParams(values);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    trackEvent("copy_share_link", { calculator_slug: def.slug });
    setTimeout(() => setCopiedLink(false), 1500);
  }

  async function shareResult() {
    const params = valuesToSearchParams(values);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    trackEvent("share_result", { calculator_slug: def.slug });
    if (navigator.share) {
      try {
        await navigator.share({ title: def.title, text: summary, url });
      } catch {
        // cancelled
      }
    } else {
      copyLink();
    }
  }

  function exportCsv() {
    downloadText(`${def.slug}-result.csv`, resultsToCsv(def, values, result));
    trackEvent("export_csv", { calculator_slug: def.slug });
  }

  function exportPdf() {
    trackEvent("export_pdf", { calculator_slug: def.slug });
    openCalculatorReport(def, values, result, getSeoContent(def.slug)?.formula);
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2 border-t border-border/60 px-5 py-3">
      <button onClick={copyResult} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-2 hover:text-foreground">
        <CopyIcon width={13} height={13} />
        {copiedResult ? "Copied!" : "Copy result"}
      </button>
      <button onClick={shareResult} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-2 hover:text-foreground">
        <ShareIcon width={13} height={13} />
        Share
      </button>
      <button onClick={copyLink} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-2 hover:text-foreground">
        <CopyIcon width={13} height={13} />
        {copiedLink ? "Link copied!" : "Copy link"}
      </button>
      <button onClick={exportCsv} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-2 hover:text-foreground">
        <DownloadIcon width={13} height={13} />
        CSV
      </button>
      <button onClick={exportPdf} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-2 hover:text-foreground">
        <DownloadIcon width={13} height={13} />
        Print report
      </button>
    </div>
  );
}
