import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Apple, User, Mail, Lock, ArrowRight } from "lucide-react";
import axios from "axios";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      user_name: name,
      user_email: email,
      user_contact: 7894561231,
      user_password: password,
      user_address: "asdsad adss das asdsad",
      user_type: "user",
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        {
          user_name: name,
          user_email: email,
          user_contact: 7894561231,
          user_password: password,
          user_address: "asdsad adss das asdsad",
          user_type: "user",
        }
      );

      if (response.status) {
        sessionStorage.setItem("logged_in_user", name);
        sessionStorage.setItem("logged_in_email", email);
        sessionStorage.setItem("logged_in_usertype", "user");
        navigate("/");
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fruit-red/5 to-fruit-purple/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ marginTop: "4rem" }}
        >
          <div className="px-8 pt-8 pb-6">
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <Apple className="h-12 w-12 text-fruit-red mx-auto" />
              </motion.div>
              <h2 className="mt-4 text-3xl font-bold bg-gradient-to-r from-fruit-red to-fruit-purple bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="mt-2 text-gray-600">Join our S Kales community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fruit-red focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fruit-red focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fruit-red focus:border-transparent"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-fruit-red to-fruit-purple text-white py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>
          </div>

          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-fruit-red hover:text-fruit-purple font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-fruit-red/5 to-fruit-purple/5 text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-fruit-red"
            >
              Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-fruit-red"
            >
              Facebook
            </motion.button>
          </div>
        </div> */}
      </motion.div>
    </div>
  );
};
