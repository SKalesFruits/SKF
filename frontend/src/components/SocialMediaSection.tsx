import React from "react";
import { motion } from "framer-motion";
import { Youtube, Instagram, Facebook, Twitter } from "lucide-react";
import { SocialMediaButton } from "./social/SocialMediaButton";
import { VideoEmbed } from "./social/VideoEmbed";
import { InstagramEmbed } from "./social/InstagramEmbed";

export const SocialMediaSection = () => {
  const socialLinks = [
    { icon: Youtube, href: "https://youtube.com", color: "bg-red-600" },
    {
      icon: Instagram,
      href: "https://instagram.com",
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    },
    { icon: Facebook, href: "https://facebook.com", color: "bg-blue-600" },
    { icon: Twitter, href: "https://twitter.com", color: "bg-blue-400" },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Follow Our Journey
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <VideoEmbed videoId="UcGm_PM2IwY" />
          <InstagramEmbed postId="DFVv4XrNLTf" />
        </div>

        <div className="flex justify-center gap-8">
          {socialLinks.map((social, index) => (
            <SocialMediaButton
              key={index}
              Icon={social.icon}
              href={social.href}
              color={social.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
