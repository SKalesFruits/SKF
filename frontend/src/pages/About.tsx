import React, { useEffect, useState } from "react";
import { SocialMediaSection } from "../components/SocialMediaSection";
import { getConfigDetailsFromDB } from "../data/config";

export const About = () => {
  const [phone_num, setPhoneNum] = useState<any>(0);
  const [email_id, setEmailId] = useState<any>("");
  useEffect(() => {
    const getConfig = async () => {
      const res = await getConfigDetailsFromDB();
      const phone_num = res.find((item) => item.config_name === "phone_num");
      const email_id = res.find((item) => item.config_name === "email_id");
      if (email_id && phone_num) {
        setEmailId(email_id.config_value);
        setPhoneNum(phone_num.config_value);
      }
    };
    getConfig();
  }, []);
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
            alt="Fruit farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Our Story
          </h1>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At GrowPhal, we believe everyone deserves access to fresh,
              high-quality fruits. Our mission is to connect local farmers with
              consumers, ensuring you get the freshest produce while supporting
              sustainable farming practices.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We carefully select each fruit that reaches your doorstep,
              maintaining strict quality standards and ensuring optimal
              freshness through our advanced storage and delivery systems.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-6">Why Choose Us</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-xl">🌱</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Sustainable Practices
                  </h3>
                  <p className="text-gray-600">
                    We work with farmers who prioritize sustainable and
                    environmentally friendly farming methods.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-xl">🚚</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">
                    Same-day delivery ensures your fruits arrive fresh and ready
                    to enjoy.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-xl">💯</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Quality Guarantee
                  </h3>
                  <p className="text-gray-600">
                    If you're not 100% satisfied with your order, we'll make it
                    right.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <SocialMediaSection />

      {/* Contact Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">{email_id}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">{phone_num}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">
                APMC Fruit Market, Plot No-3 & 7, Sector-19
                <br />
                Turbhe,Navi Mumbai, 400705
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
