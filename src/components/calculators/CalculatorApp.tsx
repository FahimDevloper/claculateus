"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { getMemory, setMemory as persistMemory } from "@/lib/storage";
import { CopyIcon, ShareIcon } from "@/components/icons";

type Op = "+" | "−" | "×" | "÷" | "^";

function applyOp(a: number, b: number, op: Op): number {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? NaN : a / b;
    case "^": return Math.pow(a, b);
  }
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function formatDisplay(n: number): string {
  if (isNaN(n)) return "Error";
  if (!isFinite(n)) return n > 0 ? "Infinity" : "-Infinity";
  if (Math.abs(n) > 1e15 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(6);
  const rounded = Math.round(n * 1e10) / 1e10;
  return rounded.toString();
}

const BASIC_BTNS: string[][] = [
  ["C", "CE", "⌫", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["±", "0", ".", "="],
];

const SCI_EXTRA: string[][] = [
  ["Deg/Rad", "sin", "cos", "tan"],
  ["x²", "x³", "xʸ", "√"],
  ["ln", "log", "1/x", "n!"],
  ["π", "e", "%", "("],
];

const MEMORY_BTNS = ["MC", "MR", "M+", "M−"];

interface Props {
  initialMode: "basic" | "scientific";
  onEquals?: (expression: string, result: string) => void;
  compact?: boolean;
  showModeSwitcher?: boolean;
}

export default function CalculatorApp({ initialMode, onEquals, compact, showModeSwitcher = true }: Props) {
  const [mode, setMode] = useState<"basic" | "scientific">(initialMode);
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<Op | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [degrees, setDegrees] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  function inputDigit(d: string) {
    if (resetNext || display === "0") {
      setDisplay(d === "." ? "0." : d);
      setResetNext(false);
    } else if (d === "." && display.includes(".")) {
      return;
    } else {
      setDisplay(display + d);
    }
  }

  function clearAll() {
    setDisplay("0");
    setExpression("");
    setPrevious(null);
    setOperator(null);
    setResetNext(false);
  }

  function clearEntry() {
    setDisplay("0");
  }

  function backspace() {
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  }

  function toggleSign() {
    setDisplay(display.startsWith("-") ? display.slice(1) : display.length && display !== "0" ? "-" + display : display);
  }

  function chooseOperator(op: Op) {
    const current = parseFloat(display);
    if (previous !== null && operator && !resetNext) {
      const result = applyOp(previous, current, operator);
      setPrevious(result);
      setExpression(`${formatDisplay(result)} ${op}`);
      setDisplay(formatDisplay(result));
    } else {
      setPrevious(current);
      setExpression(`${formatDisplay(current)} ${op}`);
    }
    setOperator(op);
    setResetNext(true);
  }

  function equals() {
    if (previous === null || !operator) return;
    const current = parseFloat(display);
    const result = applyOp(previous, current, operator);
    const fullExpr = `${formatDisplay(previous)} ${operator} ${formatDisplay(current)}`;
    setExpression(`${fullExpr} =`);
    setDisplay(formatDisplay(result));
    setPrevious(null);
    setOperator(null);
    setResetNext(true);
    onEquals?.(fullExpr, formatDisplay(result));
  }

  function applyUnary(fn: (n: number) => number, label: string) {
    const current = parseFloat(display);
    const result = fn(current);
    setExpression(`${label}(${formatDisplay(current)})`);
    setDisplay(formatDisplay(result));
    setResetNext(true);
    onEquals?.(`${label}(${formatDisplay(current)})`, formatDisplay(result));
  }

  function handleMemory(btn: string) {
    const current = parseFloat(display);
    if (btn === "MC") { persistMemory(0); setHasMemory(false); return; }
    if (btn === "MR") { setDisplay(formatDisplay(getMemory())); setResetNext(true); return; }
    if (btn === "M+") { persistMemory(getMemory() + current); setHasMemory(true); return; }
    if (btn === "M−") { persistMemory(getMemory() - current); setHasMemory(true); return; }
  }

  function handleSciButton(btn: string) {
    const toRad = (deg: number) => (degrees ? (deg * Math.PI) / 180 : deg);
    switch (btn) {
      case "Deg/Rad": setDegrees((d) => !d); return;
      case "sin": applyUnary((n) => Math.sin(toRad(n)), "sin"); return;
      case "cos": applyUnary((n) => Math.cos(toRad(n)), "cos"); return;
      case "tan": applyUnary((n) => Math.tan(toRad(n)), "tan"); return;
      case "x²": applyUnary((n) => n * n, "sqr"); return;
      case "x³": applyUnary((n) => n * n * n, "cube"); return;
      case "xʸ": chooseOperator("^"); return;
      case "√": applyUnary((n) => Math.sqrt(n), "√"); return;
      case "ln": applyUnary((n) => Math.log(n), "ln"); return;
      case "log": applyUnary((n) => Math.log10(n), "log"); return;
      case "1/x": applyUnary((n) => 1 / n, "1/x"); return;
      case "n!": applyUnary((n) => factorial(n), "!"); return;
      case "π": setDisplay(formatDisplay(Math.PI)); setResetNext(true); return;
      case "e": setDisplay(formatDisplay(Math.E)); setResetNext(true); return;
      case "%": applyUnary((n) => n / 100, "%"); return;
      case "(": return;
    }
  }

  function handleClick(btn: string) {
    if (/^[0-9]$/.test(btn)) return inputDigit(btn);
    if (btn === ".") return inputDigit(".");
    if (btn === "C") return clearAll();
    if (btn === "CE") return clearEntry();
    if (btn === "⌫") return backspace();
    if (btn === "±") return toggleSign();
    if (btn === "=") return equals();
    if (MEMORY_BTNS.includes(btn)) return handleMemory(btn);
    if (["+", "−", "×", "÷"].includes(btn)) return chooseOperator(btn as Op);
    handleSciButton(btn);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const key = e.key;
    if (/^[0-9]$/.test(key)) return handleClick(key);
    if (key === ".") return handleClick(".");
    if (key === "+") return handleClick("+");
    if (key === "-") return handleClick("−");
    if (key === "*") return handleClick("×");
    if (key === "/") { e.preventDefault(); return handleClick("÷"); }
    if (key === "Enter" || key === "=") { e.preventDefault(); return handleClick("="); }
    if (key === "Backspace") return handleClick("⌫");
    if (key === "Escape") return handleClick("C");
    if (key === "%") return handleClick("%");
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  async function shareResult() {
    const text = `${expression ? expression + " " : ""}${display}`.trim();
    if (navigator.share) {
      try {
        await navigator.share({ text: `Calculateus: ${text}` });
      } catch {
        // user cancelled — ignore
      }
    } else {
      copyResult();
    }
  }

  const grid = mode === "scientific" ? [...SCI_EXTRA, ...BASIC_BTNS] : BASIC_BTNS;

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`glass mx-auto w-full ${compact ? "max-w-sm" : "max-w-md"} overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]`}
    >
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        {showModeSwitcher ? (
          <div className="flex gap-1">
            <button onClick={() => setMode("basic")} className={`relative rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${mode === "basic" ? "text-primary-foreground" : "text-muted"}`}>
              {mode === "basic" && <motion.span layoutId="calc-mode-pill" className="absolute inset-0 -z-10 rounded-md bg-primary" transition={{ type: "spring", stiffness: 500, damping: 34 }} />}
              Basic
            </button>
            <button onClick={() => setMode("scientific")} className={`relative rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${mode === "scientific" ? "text-primary-foreground" : "text-muted"}`}>
              {mode === "scientific" && <motion.span layoutId="calc-mode-pill" className="absolute inset-0 -z-10 rounded-md bg-primary" transition={{ type: "spring", stiffness: 500, damping: 34 }} />}
              Scientific
            </button>
          </div>
        ) : (
          <span className="text-xs font-semibold text-muted">{mode === "basic" ? "Basic" : "Scientific"}</span>
        )}
        <div className="flex items-center gap-2">
          {hasMemory && <span className="text-xs font-bold text-accent">M</span>}
          {mode === "scientific" && <span className="text-xs font-medium text-muted">{degrees ? "DEG" : "RAD"}</span>}
          <button
            onClick={copyResult}
            aria-label="Copy result"
            className="rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-primary"
          >
            <CopyIcon width={15} height={15} />
          </button>
          <button
            onClick={shareResult}
            aria-label="Share result"
            className="rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-primary"
          >
            <ShareIcon width={15} height={15} />
          </button>
        </div>
      </div>
      <div className="px-5 pt-5 pb-3 text-right">
        <div className="h-5 truncate text-sm text-muted">{expression || " "}</div>
        <motion.div
          key={display}
          initial={isFirstRender.current ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="mt-1 truncate text-4xl font-bold text-foreground"
        >
          {display}
        </motion.div>
        {copied && <div className="mt-1 text-xs font-medium text-accent">Copied!</div>}
      </div>
      <div className="grid grid-cols-4 gap-1.5 px-4 pt-1">
        {MEMORY_BTNS.map((btn) => (
          <motion.button
            key={btn}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleClick(btn)}
            className="rounded-lg py-1.5 text-[11px] font-semibold text-muted transition hover:bg-surface-2 hover:text-foreground"
          >
            {btn}
          </motion.button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 p-4 pt-2">
        {grid.flat().map((btn, i) => {
          const isOperator = ["÷", "×", "−", "+", "="].includes(btn);
          const isFunc = !/^[0-9.]$/.test(btn) && !isOperator;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleClick(btn)}
              className={`rounded-xl py-3 text-base font-semibold transition-colors ${
                btn === "="
                  ? "btn-primary"
                  : isOperator
                  ? "bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary"
                  : isFunc
                  ? "bg-surface-2 text-muted hover:text-foreground"
                  : "bg-surface-2 text-foreground hover:bg-border"
              }`}
            >
              {btn}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
