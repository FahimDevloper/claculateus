"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getCalculator } from "@/lib/calculators/registry";
import CalculatorRunner from "./CalculatorRunner";

export interface ModeTab {
  id: string;
  label: string;
  defSlug: string;
}

export default function MultiModeCalculator({ tabs, tabPillId }: { tabs: ModeTab[]; tabPillId: string }) {
  const [active, setActive] = useState(tabs[0].id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];
  const def = getCalculator(activeTab.defSlug);

  return (
    <div className="w-full">
      <div className="scrollbar-thin mb-6 flex flex-nowrap gap-1 overflow-x-auto rounded-full border border-border bg-surface/80 p-1 backdrop-blur">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === t.id ? "text-primary-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {active === t.id && (
              <motion.span
                layoutId={tabPillId}
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
              />
            )}
            {t.label}
          </button>
        ))}
      </div>

      {def ? (
        <div key={def.slug}>
          {def.intro && <p className="mb-4 text-sm text-muted">{def.intro}</p>}
          <CalculatorRunner def={def} />
        </div>
      ) : (
        <p className="text-sm text-danger">This mode isn&apos;t available right now.</p>
      )}
    </div>
  );
}
