import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./LoadingScreen.css"; // Import your CSS for styling
import Apple from "./apple.svg";
import Banana from "./banana.svg";
import Avocado from "./avocado.svg";
import Peach from "./peach.svg";
import Melon from "./watermelon.svg";
import Lemon from "./lemon.svg";
import Grape from "./grape.svg";

const fruits = [
  { id: 1, src: Apple, alt: "Apple", x: "5%", y: "10%" },
  { id: 2, src: Banana, alt: "Banana", x: "75%", y: "5%" },
  { id: 3, src: Avocado, alt: "Avocado", x: "90%", y: "35%" },
  { id: 4, src: Peach, alt: "Peach", x: "30%", y: "70%" },
  { id: 5, src: Melon, alt: "Melon", x: "85%", y: "75%" },
  { id: 6, src: Lemon, alt: "Lemon", x: "15%", y: "90%" },
  { id: 7, src: Grape, alt: "Grape", x: "50%", y: "50%" },
];

const fruitAnimations = [
  { y: [0, -50, 50, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] },
  { x: [0, 50, -50, 0], y: [0, -30, 30, 0], rotate: [0, 10, -10, 0] },
  { scale: [1, 1.3, 1], rotate: [0, 20, -20, 0], opacity: [1, 0.7, 1] },
  { y: [0, -60, 60, 0], x: [0, 30, -30, 0], scale: [1, 1.2, 1] },
  { rotate: [0, 25, -25, 0], x: [0, -40, 40, 0], opacity: [1, 0.5, 1] },
  { y: [0, 50, -50, 0], scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] },
  { x: [0, 60, -60, 0], y: [0, -20, 20, 0], opacity: [1, 0.8, 1] },
];


const LoadingScreen: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="loading-screen">
      <motion.div
        className="background-animation"
        initial={{ scale: 1 }}
        animate={{ scale: 1.2, rotate: 360 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 5 }}
      />
      <motion.div className="gradient-bg" />
      {fruits.map((fruit, index) => (
        <motion.img
          key={fruit.id}
          src={fruit.src}
          alt={fruit.alt}
          className="fruit"
          style={{ left: fruit.x, top: fruit.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            ...fruitAnimations[index % fruitAnimations.length],
          }}
          transition={{
            duration: 2,
            delay: index * 0.3,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}
      <motion.div
        className="logo"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 1, delay: fruits.length * 0.2 }}
      >
        Growफल
      </motion.div>
      <motion.p
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* Gathering Freshness... */}
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
