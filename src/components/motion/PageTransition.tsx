"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { trackPageView } from "@/lib/analytics";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
    isFirstRender.current = false;
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={isFirstRender.current ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
