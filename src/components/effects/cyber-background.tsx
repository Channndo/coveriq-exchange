"use client";

import { motion } from "framer-motion";

export function CyberBackground() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/20 via-transparent to-primary-dark" />

      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-accent-bright/60 shadow-[0_0_12px_#22d3ee]"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.8, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}
