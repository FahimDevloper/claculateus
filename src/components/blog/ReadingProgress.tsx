"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-16 z-30 h-0.5 w-full bg-transparent">
      <motion.div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} transition={{ duration: 0.1 }} />
    </div>
  );
}
