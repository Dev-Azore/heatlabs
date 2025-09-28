"use client";

import { motion } from "framer-motion";

/**
 * AnimatedBlock
 * - Generic wrapper for any block element.
 * - Adds fade + slide-in when in viewport.
 */
export default function AnimatedBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
