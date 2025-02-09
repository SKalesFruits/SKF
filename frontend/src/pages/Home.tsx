import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Star } from "lucide-react";
import { products } from "../data/products";
import { Product, Reviews } from "../types";
import "./Home.css";
import { reviews } from "../data/reviews";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [reviewsList, setReviews] = useState<Reviews[]>([]);
  useEffect(() => {
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

      <div
        id="hero-section"
        className="relative h-[600px] -mt-[104px] bg-cover bg-center transition-all"
        style={{
          backgroundImage:
            "url('https://oldjoes.co.za/wp-content/uploads/2016/06/fruit-parallax.jpg')",
        }}
      >
        {/* <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1200"
            alt="Fresh fruits"
            className="w-full h-full object-cover"
          /> */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center pt-[104px]">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Fresh Fruits Delivered
            </h1>
            <p className="text-xl mb-8 animate-slide-up">
              From nature to your doorstep
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
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
            {filteredProducts
              .filter((item) => item.popularity > 3)
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
                  <p className="text-green-600 font-bold">{deal.price}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* Fruit Finder Section */}
      <div className="py-20 bg-gradient-to-b from-green-100 to-green-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-6">
            Find Your Favorite Fruits 🍎🍊🍇
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
