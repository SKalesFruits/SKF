import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Plus, Minus, Leaf, Sun } from "lucide-react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import { calculateDiscountedPrice } from "../utils/price";
import { RelatedProducts } from "../components/RelatedProducts";
import { Product } from "../types";

const mockReviews = [
  {
    id: 1,
    user: "Sarah M.",
    rating: 5,
    comment: "The freshest fruits I've ever ordered online!",
    date: "2024-03-01",
  },
  {
    id: 2,
    user: "John D.",
    rating: 4,
    comment: "Great quality, but delivery was a bit delayed.",
    date: "2024-02-28",
  },
];

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      const res = await products();
      setItems(res);
    };
    getProducts();
  }, []);
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
  const relatedProducts = items
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 6);

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${product.category}-gradient rounded-xl overflow-hidden`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-cover mix-blend-overlay"
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
                  ${product.price}
                </span>
                <span className="text-fruit-red text-3xl font-bold">
                  ${discountedPrice}
                </span>
                <span className="bg-fruit-red/10 text-fruit-red px-2 py-1 rounded-full text-sm">
                  10% OFF
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.organic && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                    <Leaf className="h-4 w-4" />
                    Organic
                  </span>
                )}
                {product.seasonal && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full flex items-center gap-1">
                    <Sun className="h-4 w-4" />
                    Seasonal
                  </span>
                )}
              </div>

              <p className="text-gray-600">{product.description}</p>

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
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <div className="border-t">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
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
                ))}
              </div>
            </div>
          </div>
          <div className="why-empty">
            {relatedProducts && relatedProducts.length > 0 ? (
              <RelatedProducts
                category={product.category}
                currentProductId={Number(id)}
              />
            ) : (
              <p>No related products available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
