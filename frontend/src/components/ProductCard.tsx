import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import { ShoppingCart, Leaf, Sun, Plus, Minus } from "lucide-react";
import { calculateDiscountedPrice } from "../utils/price";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch, state } = useCart();
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = calculateDiscountedPrice(product.price);
  const gradientClass = `${product.category}-gradient`;

  // Find if product is in cart and set initial quantity
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <Link to={`/product/${product.id}`}>
        <div className={`relative h-48 ${gradientClass}`}>
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
          <div className="text-right">
            <span className="text-gray-500 line-through text-sm">
              ${product.price}
            </span>
            <span className="text-fruit-red text-xl font-bold block">
              ${discountedPrice}
            </span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
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
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 border-x">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="w-full bg-fruit-red text-white py-3 rounded-xl hover:bg-fruit-purple transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};
