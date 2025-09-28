"use client";

import { motion } from "framer-motion";

/**
 * AnimatedParagraph
 * - Animated text for subtitles, captions, or small labels.
 */
export default function AnimatedParagraph({
  children,
  delay = 0,
  small = false,
}: {
  children: React.ReactNode;
  delay?: number;
  small?: boolean;
}) {
  return (
    <motion.p
      className={`${
        small
          ? "mt-4 text-slate-400 text-sm"
          : "text-slate-400 mb-6 max-w-2xl mx-auto"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.p>
  );
}
