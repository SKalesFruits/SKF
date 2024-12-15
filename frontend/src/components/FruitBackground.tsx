import React from "react";
import { motion } from "framer-motion";

export const FruitBackground = () => {
  const fruits = ["🍎", "🍊", "🍇", "🍓", "🍐", "🥝"];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {fruits.map((fruit, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
          }}
          animate={{
            y: window.innerHeight + 50,
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {fruit}
        </motion.div>
      ))}
    </div>
  );
};
