import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const commonQuestions = [
  {
    id: 1,
    question: "How does delivery work?",
    answer:
      "We deliver within 24 hours in most areas. Delivery is free for orders above $50.",
  },
  {
    id: 2,
    question: "Are your fruits organic?",
    answer:
      "Yes, we offer both organic and conventional fruits. Look for the organic badge on our products.",
  },
  {
    id: 3,
    question: "What's your return policy?",
    answer:
      "If you're not satisfied with the quality, we offer full refunds within 24 hours of delivery.",
  },
  {
    id: 4,
    question: "Do you have a subscription service?",
    answer:
      "Yes! You can subscribe to weekly or monthly fruit boxes at a 15% discount.",
  },
];

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([{ text: "Hello! How can I help you today?", isUser: false }]);

  const handleQuestionClick = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      { text: question, isUser: true },
      { text: answer, isUser: false },
    ]);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-fruit-red text-white p-4 rounded-full shadow-lg z-50"
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
            <div className="p-4 bg-fruit-red text-white rounded-t-2xl flex justify-between items-center">
              <h3 className="font-semibold">SKales Assistant</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? "bg-fruit-red text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Common Questions
              </h4>
              <div className="space-y-2">
                {commonQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(q.question, q.answer)}
                    className="w-full text-left text-sm p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
