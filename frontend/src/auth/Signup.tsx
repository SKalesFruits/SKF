import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [citiesList, setCityList] = useState<Cities[]>([]);
  const [orderLocation, setOrderLocation] = useState(
    localStorage.getItem("orderLocation") || ""
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
      const url = isSignup
        ? `${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`
        : `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`;
      const payload = isSignup
        ? {
            user_name: name,
            user_email: email,
            user_city: orderLocation,
            user_contact: contact,
            user_password: password,
            user_address: address,
            user_pincode: pincode,
            user_type: "user",
          }
        : { username: email, password: password };

      const response = await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem(
          "logged_in_user",
          name !== "" ? name : response.data["user_name"]
        );
        localStorage.setItem(
          "logged_in_email",
          email !== "" ? email : response.data["user_email"]
        );
        localStorage.setItem("logged_in_usertype", "user");
        localStorage.setItem(
          "logged_in_user_address",
          address !== "" ? address : response.data["user_address"]
        );
        localStorage.setItem(
          "logged_in_user_pincode",
          pincode !== "" ? pincode : response.data["user_pincode"]
        );
        localStorage.setItem(
          "logged_in_user_city",
          orderLocation !== "" ? orderLocation : response.data["user_city"]
        );

        toast.success(
          `Welcome ${localStorage.getItem("logged_in_user") || "User"}!`,
          {
            duration: 5000,
            position: "top-right",
            style: { background: "#4287f5", color: "#fff" },
            icon: "🤝",
          }
        );
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid credentials or email already registered!", {
        duration: 5000,
        position: "top-right",
        style: { background: "#FF0000", color: "#fff" },
      });
      console.error("Network error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[90%] max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isSignup ? "Create Account" : "Sign In"}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {isSignup ? "Join our Growफल community" : "Welcome back!"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              placeholder="Password"
              required
            />
          </div>

          {isSignup && (
            <>
              <div className="relative">
                <LocateIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
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

              <div className="relative">
                <MapPinCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Address"
                  required
                />
              </div>

              <div className="relative">
                <SearchX className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Pincode"
                  required
                />
              </div>
              <div className="relative">
                <Contact2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Contact Number"
                  required
                />
              </div>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
          >
            {isSignup ? "Create Account" : "Sign In"}{" "}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-orange-600 hover:underline cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};
