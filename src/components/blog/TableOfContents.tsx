"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/lib/markdown";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">On this page</p>
      <ul className="flex flex-col gap-2 border-l border-border pl-4 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block transition-colors ${activeId === h.id ? "font-semibold text-primary" : "text-muted hover:text-foreground"}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
