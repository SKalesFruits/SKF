import React, { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fruits = ["Apple", "Mango", "Banana", "Grapes", "Orange"];

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Are you a Business or a Customer?", isUser: false },
  ]);
  const [userType, setUserType] = useState<"Business" | "Customer" | null>(
    null
  );
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);
  const [showFruitSelection, setShowFruitSelection] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<{
    [key: string]: string;
  }>({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  const router = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelection = (type: "Business" | "Customer") => {
    setUserType(type);
    setMessages((prev) => [...prev, { text: type, isUser: true }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Do you wish to check out our Import-Export services or get a Quick Quote?",
          isUser: false,
        },
      ]);
      setShowOptions(true);
    }, 500);
  };

  const handleOptionSelect = (option: "More Details" | "Get Quick Quote") => {
    setShowOptions(false);
    if (option === "More Details") {
      router("/impex");
    } else {
      setMessages((prev) => [
        ...prev,
        { text: option, isUser: true },
        { text: "Which fruit are you interested in?", isUser: false },
      ]);
      setShowFruitSelection(true);
    }
  };

  const handleFruitSelect = (fruit: string) => {
    setSelectedFruits((prev) =>
      prev.includes(fruit) ? prev.filter((f) => f !== fruit) : [...prev, fruit]
    );
  };

  const handleConfirmFruits = () => {
    setShowFruitSelection(false);
    setMessages((prev) => [
      ...prev,
      { text: `Selected fruits: ${selectedFruits.join(", ")}`, isUser: true },
      {
        text: "Provide your business details for getting the quotation",
        isUser: false,
      },
    ]);
  };

  const handleBusinessInput = (field: string, value: string) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#f77f00] text-white p-4 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-xl z-50"
          >
            <div className="p-4 bg-[#F77F00] text-white rounded-t-2xl flex justify-between items-center">
              <h3 className="font-semibold">Growफल Assistant</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? "bg-[#fcbf49] text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {!userType && (
              <div className="p-4 border-t flex space-x-2">
                <button
                  onClick={() => handleSelection("Business")}
                  className="w-1/2 p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Business
                </button>
                <button
                  onClick={() => handleSelection("Customer")}
                  className="w-1/2 p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Customer
                </button>
              </div>
            )}

            {showOptions && (
              <div className="p-4 border-t space-y-2">
                <button
                  onClick={() => handleOptionSelect("More Details")}
                  className="w-full p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  More Details
                </button>
                <button
                  onClick={() => handleOptionSelect("Get Quick Quote")}
                  className="w-full p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Get Quick Quote
                </button>
              </div>
            )}

            {showFruitSelection && (
              <div className="p-4 border-t space-y-2">
                {fruits.map((fruit) => (
                  <button
                    key={fruit}
                    className={`px-5 py-2 m-1 rounded-lg ${
                      selectedFruits.includes(fruit)
                        ? "bg-[#F77F00] text-white"
                        : "bg-[#E9E1B6] hover:bg-[#E9E1B6]"
                    }`}
                    onClick={() => handleFruitSelect(fruit)}
                  >
                    {fruit}
                  </button>
                ))}
                <div className="">
                  <input
                    type={"number"}
                    placeholder="Quantity"
                    className="px-5 py-2 m-1 rounded-lg"
                  ></input>
                  <p className="px-5 py-2 m-1 rounded-lg">Metric Tons</p>
                </div>
                {selectedFruits.length > 0 && (
                  <button
                    onClick={handleConfirmFruits}
                    className="w-full p-2 bg-[#fcbf49] text-white rounded-lg mt-2"
                  >
                    Confirm
                  </button>
                )}
              </div>
            )}

            {selectedFruits.length > 0 && (
              <div className="p-4 border-t space-y-2">
                {Object.keys(businessDetails).map((key) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={key
                      .replace("name", "Business Name")
                      .replace("email", "Email ID")
                      .replace("phone", "Phone Number")
                      .replace("country", "Country to be imported")}
                    className="w-full p-2 border rounded-lg"
                    value={businessDetails[key]}
                    onChange={(e) => handleBusinessInput(key, e.target.value)}
                  />
                ))}
                <button className="w-full bg-[#f77f00] text-white py-2 rounded mt-2">
                  Send Enquiry
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
