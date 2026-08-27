"use client";

import { motion } from "framer-motion";

/**
 * Page transition. Opacity ONLY — never a transform on this wrapper.
 * A transformed ancestor changes fixed positioning and breaks
 * ScrollTrigger pinning.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
