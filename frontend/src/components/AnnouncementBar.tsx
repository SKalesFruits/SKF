import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const announcements = [
  "🎉 Free delivery on orders above ₹500!",
  "🌟 New seasonal fruits just arrived!",
  "💫 Get 10% off on your first order",
  "🎁 Special weekend offer: Buy 2 Get 1 Free on all berries",
];

export const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#eae2b7] text-white py-2 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-black"
        >
          {announcements[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
