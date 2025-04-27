import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Star } from "lucide-react";
import { products } from "../data/products";
import { Product, Reviews } from "../types";
import "./Home.css";
import { reviews } from "../data/reviews";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setMode } from "../features/general.slice";

const images = [
  "https://images.unsplash.com/photo-1472479427421-c6daa7ce0f7b?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [reviewsList, setReviews] = useState<Reviews[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  useEffect(() => {
    dispatch(setMode("home"));
    const getProducts = async () => {
      const res = await products();
      const restwo = await reviews();
      setItems(res);
      setReviews(restwo);
    };
    getProducts();
    const handleScroll = () => {
      const hero = document.getElementById("hero-section");
      if (hero) {
        let scrollTop = window.scrollY;
        hero.style.backgroundPositionY = `${scrollTop * 0.5}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const filteredProducts = items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}

      <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Hero Slide"
            className="absolute w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>

        {/* Dark Gradient Overlay for Better Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-4 max-w-[90%] lg:max-w-[60%] mx-auto">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            {currentIndex === 0 && "Freshness Delivered to Your Doorstep"}
            {currentIndex === 1 && "Handpicked Organic Goodness"}
            {currentIndex === 2 && "Taste the Sweetness of Nature"}
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg md:text-xl text-white mt-2 opacity-90 leading-relaxed max-w-[80%] md:max-w-[60%]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {currentIndex === 0 &&
              "Discover farm-fresh fruits packed with nutrition and taste."}
            {currentIndex === 1 &&
              "We source only the best, organically grown fruits for you."}
            {currentIndex === 2 &&
              "Experience the juiciest, most delicious seasonal picks."}
          </motion.p>

          {/* CTA Button */}
          <Link to={currentIndex === 0 ? "/shop" : "/about"}>
            <motion.a
              className="mt-4 px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg font-semibold text-white bg-green-600 rounded-full shadow-lg transition-all hover:bg-green-700 self-center w-full max-w-[250px] text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {currentIndex === 0 ? "Shop Now" : "Learn More"}
            </motion.a>
          </Link>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-3 md:left-6 z-10 bg-black/30 text-white p-2 sm:p-4 rounded-full backdrop-blur-md transition-transform transform hover:scale-110 hover:bg-black/50"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 md:right-6 z-10 bg-black/30 text-white p-2 sm:p-4 rounded-full backdrop-blur-md transition-transform transform hover:scale-110 hover:bg-black/50"
        >
          ❯
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-gray-400 opacity-70"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Organic Selection</h3>
              <p className="text-gray-600">
                Carefully sourced organic fruits for your health
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Same day delivery to your doorstep
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">
                100% satisfaction or money back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviewsList.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md text-left"
              >
                <p className="italic text-gray-700">"{testimonial.comment}"</p>
                <div className="mt-4">
                  <p className="font-bold">{testimonial.user}</p>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Seasonal Deals Section */}
      <div className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Seasonal Offers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {items
              .filter((item) => item.popularity > 0)
              .slice(0, 3)
              .map((deal, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-md relative cursor-pointer"
                  onClick={() => navigate(`/product/${deal.id}`)}
                >
                  {" "}
                  {/* Added relative for positioning */}
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  {/* Popular Badge */}
                  <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded text-xs font-semibold">
                    Popular
                  </div>
                  <h3 className="text-xl font-semibold">{deal.name}</h3>
                  <p className="text-green-600 font-bold">₹{deal.price}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Fruit Finder Section */}
      <div className="py-20 bg-gradient-to-b from-green-100 to-green-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-6">
            Find Your Favourite Fruits 🍎🍊🍇
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Search for fresh and delicious fruits from our collection!
          </p>

          <div className="relative md:w-2/3 mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for fruits..."
                className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-full shadow-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Search Suggestions */}
            {searchTerm && (
              <div className="absolute left-0 right-0 mt-3 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                {filteredProducts.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                        onClick={() => navigate(`/product/${product.id}`)}
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
                  <div className="px-4 py-3 text-gray-500">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
