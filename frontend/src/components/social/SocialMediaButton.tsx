import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SocialMediaButtonProps {
  Icon: LucideIcon;
  href: string;
  color: string;
}

export const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({
  Icon,
  href,
  color,
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      className={`p-4 ${color} text-white rounded-full`}
    >
      <Icon className="h-6 w-6" />
    </motion.a>
  );
};
