"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { monthlyPayment } from "@/lib/finance";
import { formatCurrency } from "@/lib/format";

interface Props {
  compact?: boolean;
  onResult?: (expression: string, result: string) => void;
}

export default function FinancePanel({ compact, onResult }: Props) {
  const [amount, setAmount] = useState(20000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const payment = useMemo(() => monthlyPayment(amount, rate, years * 12), [amount, rate, years]);
  const total = payment * years * 12;
  const interest = total - amount;

  function logResult() {
    onResult?.(`${formatCurrency(amount)} @ ${rate}% for ${years}y`, formatCurrency(payment));
  }

  const commitProps = { onMouseUp: logResult, onTouchEnd: logResult, onKeyUp: logResult };

  return (
    <div className={`glass mx-auto w-full ${compact ? "max-w-sm" : "max-w-md"} overflow-hidden rounded-3xl`}>
      <div className="border-b border-border/60 px-4 py-2.5">
        <span className="text-xs font-semibold text-muted">Loan & Mortgage Payment</span>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <label className="flex flex-col gap-1.5">
          <span className="flex justify-between text-xs font-medium text-muted">
            <span>Loan Amount</span>
            <span className="text-foreground">{formatCurrency(amount)}</span>
          </span>
          <input
            type="range" min={1000} max={1000000} step={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="accent-[var(--primary)]"
            {...commitProps}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="flex justify-between text-xs font-medium text-muted">
            <span>Interest Rate</span>
            <span className="text-foreground">{rate}%</span>
          </span>
          <input
            type="range" min={0.5} max={20} step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="accent-[var(--primary)]"
            {...commitProps}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="flex justify-between text-xs font-medium text-muted">
            <span>Term</span>
            <span className="text-foreground">{years} years</span>
          </span>
          <input
            type="range" min={1} max={30} step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="accent-[var(--primary)]"
            {...commitProps}
          />
        </label>

        <div className="mt-1 rounded-2xl bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] p-4 text-center">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">Monthly Payment</div>
          <motion.div
            key={payment}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mt-1 text-3xl font-bold text-primary"
          >
            {formatCurrency(payment)}
          </motion.div>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Total Interest</span>
          <span className="font-semibold text-foreground">{formatCurrency(interest)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Total Paid</span>
          <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
        </div>
        <a href="/calculators/loan" className="text-center text-xs font-semibold text-primary hover:underline">
          Open full Loan Calculator →
        </a>
      </div>
    </div>
  );
}
