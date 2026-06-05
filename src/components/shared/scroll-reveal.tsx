"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  yOffset = 30,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Кубическая безье-кривая в стиле Apple (ease-out)
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
