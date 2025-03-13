import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Linkedin,
} from "lucide-react";
import axios from "axios";
import WhatsappIcn from "./whatsapp_icn.svg";
import toast from "react-hot-toast";
import { getConfigDetailsFromDB } from "../data/config";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [yt_link, setyt_link] = useState<any>("");
  const [fb_link, setfb_link] = useState<any>("");
  const [tw_link, settw_link] = useState<any>("");
  const [lkdn_link, setlkdn_link] = useState<any>("");
  const [phone_num, setPhone_num] = useState<any>(null);
  const [ig_link, setig_link] = useState<any>("");
  useEffect(() => {
    const getConfig = async () => {
      const res = await getConfigDetailsFromDB();
      const yt_link = res.find((item) => item.config_name === "yt_link");
      const fb_link = res.find((item) => item.config_name === "fb_link");
      const tw_link = res.find((item) => item.config_name === "tw_link");
      const lkdn_link = res.find((item) => item.config_name === "lkdn_link");
      const ig_link = res.find((item) => item.config_name === "ig_link");
      const phonenum = res.find((item) => item.config_name === "wa_phone_num");
      if (yt_link && fb_link && tw_link && lkdn_link && ig_link && phonenum) {
        setyt_link(yt_link.config_value);
        setfb_link(fb_link.config_value);
        settw_link(tw_link.config_value);
        setlkdn_link(lkdn_link.config_value);
        setig_link(ig_link.config_value);
        setPhone_num(
          phonenum.config_value === null ? 0 : phonenum.config_value
        );
      }
    };
    getConfig();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/newsletter`,
      {
        email: email,
      }
    );
    if (response.status === 200) {
      toast.success("Congrats! You are added to GrowPhal gang", {
        duration: 5000, // Optional: controls how long the toast stays
        position: "top-right",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
        icon: "🔥",
      });
      setEmail("");
    } else {
    }
  };

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-fruit-red">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-fruit-red">
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-fruit-red"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-fruit-red">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-gray-600 hover:text-fruit-red"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-600 hover:text-fruit-red"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-600 hover:text-fruit-red"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-gray-600 hover:text-fruit-red"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href={fb_link} className="text-gray-600 hover:text-fruit-red">
                <Facebook className="h-6 w-6" />
              </a>
              <a href={tw_link} className="text-gray-600 hover:text-fruit-red">
                <Twitter className="h-6 w-6" />
              </a>
              <a href={ig_link} className="text-gray-600 hover:text-fruit-red">
                <Instagram className="h-6 w-6" />
              </a>
              <a href={yt_link} className="text-gray-600 hover:text-fruit-red">
                <Youtube className="h-6 w-6" />
              </a>
              <a
                href={lkdn_link}
                className="text-gray-600 hover:text-fruit-red"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href={`https://wa.me/${phone_num}?text=Hello%21%20I%20want%20to%20send%20an%20enquiry`}
                className="text-gray-600 hover:text-fruit-red"
              >
                <img src={WhatsappIcn} className="h-6 w-6" />
              </a>
              {/* <a
                href={`https://wa.me/${phone_num.config_value}?text=Hello%21%20I%20want%20to%20send%20an%20enquiry`}
              >
                <MessageCircleIcon className="h-6 w-6" />
              </a> */}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <p className="text-gray-600 text-sm">
                Subscribe to get updates about our products and offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-fruit-red"
                  required
                />
                <button
                  type="submit"
                  className="bg-fruit-red text-white px-4 py-2 rounded-r-lg hover:bg-fruit-purple transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-gray-600 flex flex-col md:flex-row items-center justify-between text-sm md:text-base gap-4 md:gap-0">
          <p>
            <span>
              &copy; {new Date().getFullYear()} GrowPhal Impex. All rights
              reserved.&nbsp;&nbsp;
            </span>
          </p>
          <p className="text-xs md:text-sm">
            Developed & Managed by{" "}
            <span
              className="text-fruit-red cursor-pointer hover:text-fruit-purple"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/nimish-thanekar",
                  "_blank"
                )
              }
            >
              Nimish Thanekar
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
