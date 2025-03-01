import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Leaf,
  Sun,
  Package,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import { reviews } from "../data/reviews";
import { calculateDiscountedPrice } from "../utils/price";
import { RelatedProducts } from "../components/RelatedProducts";
import { Product, Reviews } from "../types";
import { ExploreMoreProducts } from "../components/ExploreMoreProducts";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [quantityEnq, setQuantityEnq] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [reviewsList, setReviewsList] = useState<Reviews[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [measurementUnit, setMeasurementUnit] = useState("Ton");
  const [mobileNumber, setMobileNumber] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    const getProducts = async () => {
      const res = await products();
      setItems(res);
      const restwo = await reviews();
      setReviewsList(restwo);
    };
    getProducts();
  }, []);
  const reviews_exist = reviewsList.find(
    (item) => item.product_id === Number(id)
  );
  const product = items.find((p) => p.id === Number(id));
  if (!product) {
    return (
      <div className="min-h-screen pt-20 text-center">Product not found</div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, price: discountedPrice, quantity },
    });
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-500 line-through text-xl">
                  ₹{product.price}
                </span>
                <span className="text-fruit-red text-3xl font-bold">
                  ₹{discountedPrice}
                </span>
                <span className="bg-fruit-red/10 text-fruit-red px-2 py-1 rounded-full text-sm">
                  10% OFF
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.organic && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                    <Leaf className="h-4 w-4" /> Organic
                  </span>
                )}
                {product.seasonal && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full flex items-center gap-1">
                    <Sun className="h-4 w-4" /> Seasonal
                  </span>
                )}
              </div>
              <p className="text-gray-600">{product.description}</p>
              <div className="grid grid-cols-2 gap-4 text-gray-800">
                <p>
                  <strong>Packaging Type:</strong> Plastic Bag
                </p>
                <p>
                  <strong>Country of Origin:</strong> India
                </p>
                <p>
                  <strong>Business Type:</strong> Exporter, Supplier, Trader
                </p>
                <p>
                  <strong>Cultivation Type:</strong> Natural
                </p>
                <p>
                  <strong>Packaging Size:</strong> 5-10 Kg
                </p>
                <p>
                  <strong>Shelf Life:</strong> 10-12 Days
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-fruit-red text-white py-3 rounded-lg hover:bg-fruit-purple transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openModal}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="h-5 w-5" /> Send Enquiry
                </motion.button>
              </div>
            </motion.div>
          </div>
          <div className="border-t p-8">
            {reviews_exist ? (
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            ) : (
              <></>
            )}
            <div className="space-y-6">
              {reviewsList.map((review) =>
                review.product_id === product.id ? (
                  <div key={review.review_id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
                          {review.user[0]}
                        </div>
                        <span className="font-medium">{review.user}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-800">{review.comment}</p>
                  </div>
                ) : (
                  <></>
                )
              )}
            </div>
          </div>
          <RelatedProducts
            category={product.category}
            currentProductId={Number(id)}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-2/3 shadow-lg flex">
              {/* Left side - Image */}
              <div className="w-1/2 flex justify-center items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-cover"
                  />
                </motion.div>
              </div>

              {/* Right side - Form */}
              <div className="w-1/2 pl-6">
                <h2 className="text-xl font-semibold mb-4">
                  Get a Quick Quote
                </h2>

                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantityEnq}
                  onChange={(e) => setQuantityEnq(e.target.value)}
                  className="w-full p-2 mb-3 border border-gray-300 rounded-md"
                />

                <div className="flex items-center mb-3">
                  <input
                    type="text"
                    value={measurementUnit}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                  <button className="text-blue-500 text-sm ml-2">Edit</button>
                </div>

                <div className="flex items-center mb-3 border border-gray-300 rounded-md p-2">
                  <span className="mr-2">🇮🇳</span>
                  <span className="mr-2">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter Mobile No."
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full outline-none"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={closeModal}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Send Enquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
