import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import {
  ShoppingCart,
  Leaf,
  Sun,
  Plus,
  Minus,
  Star,
  Flame,
} from "lucide-react";
import { calculateDiscountedPrice } from "../utils/price";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch, state } = useCart();
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = calculateDiscountedPrice(product.price);
  const gradientClass = `${product.category}-gradient`;
  const discountPercentage = Math.round(
    ((product.price - discountedPrice) / product.price) * 100
  );

  // Check if product is in cart and set initial quantity
  useEffect(() => {
    const cartItem = state.items.find((item) => item.id === product.id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [state.items, product.id]);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, price: discountedPrice, quantity },
    });
  };
  const stock = product.stock ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden relative group transition-all"
    >
      {/* Discount Tag */}
      {discountPercentage > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full"
        >
          🔥 {discountPercentage}% OFF
        </motion.div>
      )}

      <Link to={`/product/${product.id}`}>
        <div className={`relative h-48 ${gradientClass} overflow-hidden`}>
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-fruit-red transition-all">
            {product.name}{" "}
            {product.popularity > 4 && (
              <span className="text-yellow-500 text-xs flex items-center">
                <Flame className="w-4 h-4 mr-1" /> Best Seller
              </span>
            )}
          </h3>

          {/* Price Display */}
          <div className="text-right">
            <span className="text-gray-500 line-through text-sm">
              ₹{product.price}
            </span>
            <span className="text-fruit-red text-xl font-bold block">
              ₹{discountedPrice}
            </span>
            <span className="text-gray-500 text-xs block mt-1">Per Dozen</span>
          </div>
        </div>

        {/* Product Description */}
        <p className="text-gray-600 text-sm h-8 mb-4">{product.description}</p>

        {/* Tags (Organic, Seasonal) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.organic && (
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1"
            >
              <Leaf className="h-3 w-3" />
              Organic
            </motion.span>
          )}
          {product.seasonal && (
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center gap-1"
            >
              <Sun className="h-3 w-3" />
              Seasonal
            </motion.span>
          )}
        </div>

        <div className="h-5 mb-3">
          {stock !== undefined && stock < 5 && stock !== 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs font-semibold"
            >
              ⚠️ Only {stock} left in stock!
            </motion.div>
          ) : (
            stock === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs font-semibold"
              >
                ⚠️We will be restocking the product soon!
              </motion.div>
            )
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition-all"
              disabled={quantity === 1} // Prevent going below 1
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 border-x">{quantity}</span>
            <button
              onClick={() =>
                setQuantity((prev) => (prev < stock ? prev + 1 : prev))
              }
              className="p-2 hover:bg-gray-100 transition-all"
              disabled={quantity >= stock} // Prevent exceeding stock
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {/* Per Dozen Label */}
          <span className="text-gray-500 text-xs">Per Dozen</span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (quantity <= stock) {
              handleAddToCart();
            }
          }}
          disabled={stock === 0} // Disable when out of stock
          className={`w-full ${
            stock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-fruit-red to-fruit-red hover:from-fruit-purple hover:to-fruit-red transition-all duration-300"
          } text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium`}
        >
          <ShoppingCart className="h-4 w-4" />
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
};
