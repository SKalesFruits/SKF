import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../types";
import { products } from "../data/products";
import { calculateDiscountedPrice } from "../utils/price";

interface RelatedProductsProps {
  currentProductId: number;
  category: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  category,
}) => {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      const res = await products();
      setItems(res);
    };
    getProducts();
  }, []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  console.log("HERE", currentProductId, category);
  const relatedProducts = items
    .filter((p) => p.id !== currentProductId)
    .slice(0, 6);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-12 px-8">
      <h2 className="text-2xl font-bold mb-6">
        Similar {category.charAt(0).toUpperCase() + category.slice(1)}
      </h2>
      <div className="relative group">
        <motion.button
          // whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/4 -translate-y-1/4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </motion.button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {relatedProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1 }}
              className="min-w-[280px] bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <Link to={`/product/${product.id}`}>
                <div
                  className={`h-48 ${product.category}-gradient relative group`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-10"
                  />
                  {product.organic && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Organic
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 line-through text-sm">
                      ₹{product.price}
                    </span>
                    <span className="text-fruit-red font-bold">
                      ₹{calculateDiscountedPrice(product.price)}
                    </span>
                    <span className="bg-fruit-red/10 text-fruit-red text-xs px-2 py-1 rounded-full">
                      10% OFF
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.button
          // whileHover={{ scale: 1 }}
          whileTap={{ scale: 1 }}
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/4 -translate-y-1/4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </motion.button>
      </div>
    </div>
  );
};
