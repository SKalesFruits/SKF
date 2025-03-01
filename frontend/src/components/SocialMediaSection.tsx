import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  LinkedinIcon,
} from "lucide-react";
import { SocialMediaButton } from "./social/SocialMediaButton";
import { VideoEmbed } from "./social/VideoEmbed";
import { InstagramEmbed } from "./social/InstagramEmbed";
import { getConfigDetailsFromDB } from "../data/config";

export const SocialMediaSection = () => {
  const [yt_link, setyt_link] = useState<any>("");
  const [fb_link, setfb_link] = useState<any>("");
  const [tw_link, settw_link] = useState<any>("");
  const [lkdn_link, setlkdn_link] = useState<any>("");
  const [ig_link, setig_link] = useState<any>("");
  const [videoId_yt, setvideoId_yt] = useState<any>("");
  const [postId_Ig, setpostId_Ig] = useState<any>("");
  useEffect(() => {
    const getConfig = async () => {
      const res = await getConfigDetailsFromDB();
      const yt_link = res.find((item) => item.config_name === "yt_link");
      const fb_link = res.find((item) => item.config_name === "fb_link");
      const tw_link = res.find((item) => item.config_name === "tw_link");
      const lkdn_link = res.find((item) => item.config_name === "lkdn_link");
      const ig_link = res.find((item) => item.config_name === "ig_link");
      const videoId_yt = res.find((item) => item.config_name === "videoId_yt");
      const postId_Ig = res.find((item) => item.config_name === "postId_Ig");
      if (
        yt_link &&
        fb_link &&
        tw_link &&
        lkdn_link &&
        ig_link &&
        videoId_yt &&
        postId_Ig
      ) {
        setyt_link(yt_link);
        setfb_link(fb_link);
        settw_link(tw_link);
        setlkdn_link(lkdn_link);
        setig_link(ig_link);
        setvideoId_yt(videoId_yt);
        setpostId_Ig(postId_Ig);
      }
    };
    getConfig();
  }, []);
  const socialLinks = [
    { icon: Youtube, href: yt_link, color: "bg-red-600" },
    {
      icon: Instagram,
      href: ig_link,
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    },
    { icon: Facebook, href: fb_link, color: "bg-blue-600" },
    { icon: Twitter, href: tw_link, color: "bg-blue-400" },
    { icon: LinkedinIcon, href: lkdn_link, color: "bg-blue-400" },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Follow Our Journey
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <VideoEmbed videoId={videoId_yt} />
          <InstagramEmbed postId={postId_Ig} />
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
