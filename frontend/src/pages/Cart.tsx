import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, CheckCircle, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { deliverycities } from "../data/cities";
import { Cities } from "../types";

export const Cart = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderPopupVisible, setIsOrderPopupVisible] = useState(false);
  const [userName, setUserName] = useState(
    sessionStorage.getItem("logged_in_user") || ""
  );
  const [citiesList, setCityList] = useState<Cities[]>([]);
  const [emailid, setEmailId] = useState(
    sessionStorage.getItem("logged_in_email") || ""
  );
  const [mobile, setMobile] = useState(sessionStorage.getItem("mobile") || "");
  const [orderLocation, setOrderLocation] = useState(
    sessionStorage.getItem("orderLocation") || ""
  );
  const [orderAddress, setOrderAddress] = useState(
    sessionStorage.getItem("orderAddress") || ""
  );
  const [error, setError] = useState("");

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const validateAndProceed = () => {
    if (!userName || !orderLocation || !orderAddress) {
      setError("All fields are required.");
      return;
    }

    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("orderLocation", orderLocation);
    sessionStorage.setItem("orderAddress", orderAddress);

    setIsModalOpen(false);
    handleCheckout();
  };

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    document.body.appendChild(script);
    const getCities = async () => {
      const res = await deliverycities();
      setCityList(res);
    };
    getCities();
  }, []);

  const float2int = (value: any) => {
    return value | 0;
  };

  const handleCheckout = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/create-order`,
        {
          amount: float2int(state.total.toFixed(2)) * 100,
          currency: "INR",
        }
      );

      const options = {
        key: "rzp_test_4dogS15wIJLRlF",
        amount: data.amount * 100,
        currency: data.currency,
        name: "Fruit E-commerce",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            await axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userName: userName,
                orderLocation: orderLocation,
                orderAddress: orderAddress,
                totalOrderAmount: state.total,
                items: state.items.map(
                  (item) => `${item.name} ( x ${item.quantity})`
                ),
              }
            );

            setIsOrderPopupVisible(true);
            dispatch({ type: "CLEAR_CART" });
            setTimeout(() => setIsOrderPopupVisible(false), 4000);
            navigate("/shop");
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment successful, but order creation failed.");
          }
        },
        prefill: {
          name: userName,
          email: emailid,
          contact: mobile,
        },
        theme: {
          color: "#FF6B6B",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Your cart is empty
          </h2>
          <Link
            to="/shop"
            className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
          Your Fruit Basket
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items List */}
          <div className="flex-1">
            {state.items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 mb-6 flex items-center transition-transform duration-200"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-semibold text-gray-700">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                    }
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-extrabold text-gray-800 text-lg">
                    <span>Total</span>
                    <span>₹{state.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="w-full bg-gradient-to-r from-red-300 to-white-500 to-red-300 text-white font-semibold px-6 py-3 rounded-lg hover:from-red-500 hover:to-red-200 hover:to-red-200 transition-ease-in-out 1.5s"
                  onClick={() => {
                    if (!userName || !orderLocation || !orderAddress) {
                      setIsModalOpen(true);
                    } else {
                      handleCheckout();
                    }
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-2xl w-96 backdrop-filter backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Enter Order Details
            </h2>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <select
              className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
            <input
              type="text"
              placeholder="Enter your contact"
              className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your Email"
              className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={emailid}
              onChange={(e) => setEmailId(e.target.value)}
            />
            <textarea
              placeholder="Enter full address"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={orderAddress}
              onChange={(e) => setOrderAddress(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
                onClick={validateAndProceed}
              >
                Confirm &amp; Proceed
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Placed Popup */}
      <AnimatePresence>
        {isOrderPopupVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-5 right-5 bg-white rounded-lg p-4 flex items-center space-x-3 border-l-4 border-green-500 shadow-xl"
          >
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-lg font-bold text-gray-800">
                Order Placed Successfully!
              </p>
              <p className="text-sm text-gray-600">
                Thank you for shopping with us.
              </p>
            </div>
            <button onClick={() => setIsOrderPopupVisible(false)}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
