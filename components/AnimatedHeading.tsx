"use client";

import { motion } from "framer-motion";

/**
 * AnimatedHeading
 * ----------------
 * - Wraps heading elements with Framer Motion.
 * - Default is <h1>, but supports <h2>, <h3>, etc. via the `as` prop.
 */
export default function AnimatedHeading({
  children,
  delay = 0,
  as = "h1",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  // Map of allowed tags → motion components
  const MotionTag = {
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
  }[as];

  return (
    <MotionTag
      className={`${
        as === "h1"
          ? "text-4xl md:text-5xl font-extrabold mb-4 text-white"
          : "text-3xl font-semibold mb-6 text-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </MotionTag>
  );
}
