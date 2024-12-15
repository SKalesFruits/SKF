import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { products } from "../data/products";
import { Product } from "../types";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      const res = await products();
      setItems(res);
    };
    getProducts();
  }, []);
  const filteredProducts = items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] -mt-[104px]">
        {" "}
        {/* Negative margin to remove gap */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1200"
            alt="Fresh fruits"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center pt-[104px]">
          {" "}
          {/* Added padding-top to account for navbar */}
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Fresh Fruits Delivered</h1>
            <p className="text-xl mb-8">From nature to your doorstep</p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
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
            {[
              {
                name: "Alice",
                comment: "The fruits are super fresh!",
                rating: "⭐️⭐️⭐️⭐️⭐️",
              },
              {
                name: "Bob",
                comment: "Fast delivery and great quality.",
                rating: "⭐️⭐️⭐️⭐️⭐️",
              },
              {
                name: "Charlie",
                comment: "Affordable and organic.",
                rating: "⭐️⭐️⭐️⭐️⭐️",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md text-left"
              >
                <p className="italic text-gray-700">"{testimonial.comment}"</p>
                <div className="mt-4">
                  <p className="font-bold">{testimonial.name}</p>
                  <p>{testimonial.rating}</p>
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
            {[
              { image: "image1_url", title: "Summer Mangoes", price: "$10/kg" },
              { image: "image2_url", title: "Winter Oranges", price: "$8/kg" },
              { image: "image3_url", title: "Exotic Berries", price: "$15/kg" },
            ].map((deal, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold">{deal.title}</h3>
                <p className="text-green-600 font-bold">{deal.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Fruit Finder Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Find Your Favorite Fruits</h2>
          <div className="relative md:w-1/2 mx-auto">
            <input
              type="text"
              placeholder="Search for fruits..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && filteredProducts.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-2 rounded-md shadow-lg z-10">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
            {searchTerm && filteredProducts.length === 0 && (
              <div className="absolute left-0 right-0 bg-white border border-gray-300 mt-2 rounded-md shadow-lg z-10 px-4 py-2">
                No results found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
