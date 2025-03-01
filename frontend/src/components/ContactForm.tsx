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
    <div className="contact-container">
      <div className="company-info">
        <p className="font-bold text-4xl">GrowPhal</p>
        <div className="info">
          <p>
            <strong>Contact Person:</strong> Mr. Gauresh Kale
          </p>
          <p>
            <strong>Address:</strong> APMC Fruit Market, Plot No-3 & 7,
            Sector-19, Turbhe, Navi Mumbai, 400705
          </p>
          <p>
            <strong>Call Us:</strong>{" "}
            <span
              className="view-number"
              onClick={() => setPhoneDisabled(true)}
            >
              {!phone_disabled ? "View Mobile Number" : phone_num}
            </span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="product-search">Products *</label>
        <div className="relative w-full">
          <div className="relative">
            <input
              id="product-search"
              type="text"
              name="product"
              placeholder="Search for fruits..."
              className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-md shadow-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={formData.product}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setFormData({ ...formData, product: e.target.value });
              }}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {searchTerm && (
            <div className="absolute left-0 right-0 mt-3 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
              {filteredProducts.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                      onClick={() => {
                        setFormData({ ...formData, product: product.name });
                        setSearchTerm(""); // Clear search after selection
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
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-gray-500">No results found.</div>
              )}
            </div>
          )}
        </div>
        {errors.product && (
          <span className="error">This field is required</span>
        )}

        <label>Your Name *</label>
        <input
          type="text"
          name="name"
          className="w-full"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">This field is required</span>}

        <label>Email *</label>
        <input
          type="email"
          name="email"
          className="w-full"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">Enter a valid email</span>}

        <label>Mobile *</label>
        <div className="mobile-input">
          <select>
            <option value="+91">+91</option>
          </select>
          <input
            type="text"
            name="mobile"
            className="w-full"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        {errors.mobile && (
          <span className="error">Enter a valid 10-digit mobile number</span>
        )}

        <label>Enquiry Details *</label>
        <textarea
          name="enquiry"
          className="w-full"
          value={formData.enquiry}
          onChange={handleChange}
        ></textarea>
        {errors.enquiry && (
          <span className="error">This field is required</span>
        )}

        <div className="button-group">
          <button type="submit" className="submit-btn">
            Submit
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              setFormData({
                product: "",
                name: "",
                email: "",
                mobile: "",
                enquiry: "",
              })
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
