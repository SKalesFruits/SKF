import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  LocateIcon,
  MapPinCheckIcon,
  SearchX,
  Contact2Icon,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { deliverycities } from "../data/cities";
import { Cities } from "../types";
import signupIllustration from "./signup.svg";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [citiesList, setCityList] = useState<Cities[]>([]);
  const [orderLocation, setOrderLocation] = useState(
    sessionStorage.getItem("orderLocation") || ""
  );
  const navigate = useNavigate();

  useEffect(() => {
    const getCities = async () => {
      const res = await deliverycities();
      setCityList(res);
    };
    getCities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URLL}/api/auth/signup`,
        {
          user_name: name,
          user_email: email,
          user_city: orderLocation,
          user_contact: contact,
          user_password: password,
          user_address: address,
          user_pincode: pincode,
          user_type: "user",
        }
      );
      if (response.status) {
        sessionStorage.setItem("logged_in_user", name);
        sessionStorage.setItem("logged_in_email", email);
        sessionStorage.setItem("logged_in_usertype", "user");
        sessionStorage.setItem("logged_in_user_address", address);
        sessionStorage.setItem("logged_in_user_pincode", pincode);
        sessionStorage.setItem("logged_in_user_city", orderLocation);
        navigate("/");
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 flex flex-col md:flex-row w-[90%] max-w-4xl gap-8">
        {/* Illustration Section */}
        <div className="hidden md:flex w-1/2 justify-center items-center">
          <img src={signupIllustration} alt="Signup" className="max-w-xs" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Join our Growफल community
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Full Name"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Email"
                required
              />
            </div>

            {/* City */}
            <div className="relative">
              <LocateIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                value={orderLocation}
                onChange={(e) => setOrderLocation(e.target.value)}
              >
                <option value="">Select a city</option>
                {citiesList.map((city) => (
                  <option key={city.city} value={city.city}>
                    {city.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="relative">
              <MapPinCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Address"
                required
              />
            </div>

            {/* Pincode */}
            <div className="relative">
              <SearchX className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Pincode"
                required
              />
            </div>

            {/* Contact */}
            <div className="relative">
              <Contact2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Contact Number"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Password"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              Create Account <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
