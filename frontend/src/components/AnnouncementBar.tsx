import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getConfigDetailsFromDB } from "../data/config";
import { Config } from "../types";

// const  = [
//   "🎉 Free delivery on orders above ₹500!",
//   "🌟 New seasonal fruits just arrived!",
//   "💫 Get 10% off on your first order",
//   "🎁 Special weekend offer: Buy 2 Get 1 Free on all berries",
// ];

export const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<any>([]);
  useEffect(() => {
    const getConfig = async () => {
      const res = await getConfigDetailsFromDB();
      const fin = res.find((item) => item.config_name === "announcements");
      if (fin) {
        setItems(fin.config_value);
      }
    };
    getConfig();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
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
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
