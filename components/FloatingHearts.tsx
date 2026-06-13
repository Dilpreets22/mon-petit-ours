"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; animationDuration: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-15), // Keep max 15 hearts to avoid performance issues
        {
          id: Date.now(),
          left: Math.random() * 100,
          animationDuration: 5 + Math.random() * 5, // 5-10s
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0 text-pink-300 opacity-60"
          style={{ left: `${heart.left}%` }}
          initial={{ y: "10vh", opacity: 0, scale: 0.5 }}
          animate={{
            y: "-110vh",
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.8],
            x: [0, Math.random() * 100 - 50, 0], // subtle swaying
          }}
          transition={{
            duration: heart.animationDuration,
            ease: "easeOut",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}
