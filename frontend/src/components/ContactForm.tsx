import React, { useEffect, useState } from "react";
import "./ContactForm.css";
import { getConfigDetailsFromDB } from "../data/config";
import { products } from "../data/products";
import { Product } from "../types";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ContactForm: React.FC = () => {
  // ... (keep all your existing state and effect hooks)
  const [phone_num, setPhoneNum] = useState<any>(0);
  const [phone_disabled, setPhoneDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const getConfig = async () => {
      const res = await getConfigDetailsFromDB();
      const restwo = await products();
      setItems(restwo);
      const phone_num = res.find((item) => item.config_name === "phone_num");
      if (phone_num) {
        setPhoneNum(phone_num.config_value);
      }
    };
    getConfig();
  }, []);

  const filteredProducts = items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formData, setFormData] = useState({
    product: "",
    name: "",
    email: "",
    mobile: "",
    enquiry: "",
  });

  const [errors, setErrors] = useState({
    product: false,
    name: false,
    email: false,
    mobile: false,
    enquiry: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    setErrors({ ...errors, [name]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors = {
      product: formData.product.trim() === "",
      name: formData.name.trim() === "",
      email:
        formData.email.trim() === "" || !/\S+@\S+\.\S+/.test(formData.email),
      mobile:
        formData.mobile.trim() === "" || !/^\d{10}$/.test(formData.mobile),
      enquiry: formData.enquiry.trim() === "",
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/enquiries`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const result = await response.json();
        if (response.ok) {
          toast.success("Operation successful!", {
            duration: 5000, // Optional: controls how long the toast stays
            position: "top-right",
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
            icon: "✅",
          });
          setFormData({
            product: "",
            name: "",
            email: "",
            mobile: "",
            enquiry: "",
          });
        } else {
          alert("Error submitting enquiry: " + result.error);
        }
      } catch (error) {
        alert("Network error, please try again.");
        console.error("Submit Error:", error);
      }
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
      >
        {/* Company Info Section */}
        <div className="bg-gradient-to-br from-green-50 to-white p-6 md:p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-fruit-red mb-6">
            GrowPhal
          </h1>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-fruit-red/10 p-2 rounded-full">
                <svg
                  className="w-5 h-5 text-fruit-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="text-gray-700">
                <strong className="text-gray-900">Contact Person:</strong> Mr. Gauresh
                Kale
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-fruit-red/10 p-2 rounded-full">
                <svg
                  className="w-5 h-5 text-fruit-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-700">
                <strong className="text-gray-900">Address:</strong> APMC Fruit
                Market, Plot No-3 & 7, Sector-19, Turbhe, Navi Mumbai, 400705
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-fruit-red/10 p-2 rounded-full">
                <svg
                  className="w-5 h-5 text-fruit-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <p className="text-gray-700">
                <strong className="text-gray-900">Call Us:</strong>{" "}
                <span
                  className={`${
                    !phone_disabled
                      ? "text-fruit-red cursor-pointer hover:underline"
                      : "text-gray-900"
                  }`}
                  onClick={() => setPhoneDisabled(true)}
                >
                  {!phone_disabled ? "View Mobile Number" : phone_num}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Enquiry Form
          </h2>

          {/* Product Search */}
          <div className="mb-6">
            <label
              htmlFor="product-search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Products *
            </label>
            <div className="relative">
              <div className="relative">
                <input
                  id="product-search"
                  type="text"
                  name="product"
                  placeholder="Search for fruits..."
                  className={`w-full px-5 py-3 pl-12 border ${
                    errors.product ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-fruit-red focus:border-transparent transition-all`}
                  value={formData.product}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFormData({ ...formData, product: e.target.value });
                  }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {searchTerm && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {filteredProducts.map((product) => (
                        <motion.li
                          key={product.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                          onClick={() => {
                            setFormData({ ...formData, product: product.name });
                            setSearchTerm("");
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="text-gray-700 font-medium">
                            {product.name}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No results found.
                    </div>
                  )}
                </div>
              )}
              {errors.product && (
                <p className="mt-1 text-sm text-red-600">
                  This field is required
                </p>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              className={`w-full px-4 py-3 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-fruit-red focus:border-transparent transition-all`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                This field is required
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              className={`w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-fruit-red focus:border-transparent transition-all`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                Enter a valid email address
              </p>
            )}
          </div>

          {/* Mobile Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile *
            </label>
            <div className="flex">
              <select className="px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fruit-red focus:border-transparent">
                <option value="+91">+91</option>
              </select>
              <input
                type="text"
                name="mobile"
                className={`flex-1 px-4 py-3 border ${
                  errors.mobile ? "border-red-500" : "border-gray-300"
                } border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-fruit-red focus:border-transparent transition-all`}
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your 10-digit mobile number"
              />
            </div>
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">
                Enter a valid 10-digit mobile number
              </p>
            )}
          </div>

          {/* Enquiry Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enquiry Details *
            </label>
            <textarea
              name="enquiry"
              rows={4}
              className={`w-full px-4 py-3 border ${
                errors.enquiry ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-fruit-red focus:border-transparent transition-all`}
              value={formData.enquiry}
              onChange={handleChange}
              placeholder="Enter your enquiry details"
            ></textarea>
            {errors.enquiry && (
              <p className="mt-1 text-sm text-red-600">
                This field is required
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-fruit-red to-fruit-purple text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all"
            >
              Submit Enquiry
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setFormData({
                  product: "",
                  name: "",
                  email: "",
                  mobile: "",
                  enquiry: "",
                })
              }
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ContactForm;
