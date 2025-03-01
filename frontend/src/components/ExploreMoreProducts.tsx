import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import { calculateDiscountedPrice } from "../utils/price";
import { Product } from "../types";

interface ExploreMoreProductsProps {
  currentProductId: number;
}

export const ExploreMoreProducts: React.FC<ExploreMoreProductsProps> = ({
  currentProductId,
}) => {
  const { dispatch } = useCart();
  const [items, setItems] = useState<Product[]>([]);
  const filteredProducts = items.filter((p) => p.id !== currentProductId);
  useEffect(() => {
    const getProducts = async () => {
      const res = await products();
      setItems(res);
    };
    getProducts();
  }, []);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Ensure multiple slides are visible
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const handleAddToCart = (product: any) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...product,
        price: calculateDiscountedPrice(product.price),
        quantity: 1,
      },
    });
  };

  return (
    <div className="py-10 px-4 mx-auto w-full overflow-hidden">
      <h2 className="text-2xl font-bold mb-6">Explore More Products</h2>
      <div className="w-full max-w-7xl mx-auto overflow-hidden">
        <Slider {...settings} className="w-full flex">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="p-4 min-w-0"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-fruit-red font-bold text-lg">
                    ₹{calculateDiscountedPrice(product.price)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 flex items-center justify-center bg-fruit-red text-white w-full py-2 rounded-lg hover:bg-fruit-purple transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
