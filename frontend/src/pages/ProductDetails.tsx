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
import toast from "react-hot-toast";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [quantityEnq, setQuantityEnq] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [reviewsList, setReviewsList] = useState<Reviews[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [measurementUnit, setMeasurementUnit] = useState("Kgs");
  const [mobileNumber, setMobileNumberEnq] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  let productSelected = "";
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
  } else {
    productSelected = product?.name;
  }

  const discountedPrice = calculateDiscountedPrice(product.price);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, price: discountedPrice, quantity },
    });
  };

  const sendEnquiry = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: productSelected,
            name: name,
            email: email,
            mobile: mobileNumber,
            enquiry: `Enquiring for Product: ${product.name}. Quantity Required :${quantityEnq} ${measurementUnit}`,
          }),
        }
      );
      if (response.status === 201) {
        toast.success("Enquiry Sent!", {
          duration: 5000, // Optional: controls how long the toast stays
          position: "top-right",
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
          icon: "✅",
        });
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setIsModalOpen(false);
      toast.error("Enquiry Failed!", {
        duration: 5000, // Optional: controls how long the toast stays
        position: "top-right",
        style: {
          background: "#FF0000",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
            <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-2xl w-96 backdrop-filter backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Enter Enquiry Details
              </h2>
              <input
                type="text"
                placeholder="Enter your Name / Business Name"
                className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter your Contact Number"
                className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={mobileNumber}
                onChange={(e) => setMobileNumberEnq(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter your Email"
                className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter your contact"
                className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={productSelected}
                readOnly
              />
              <span>
                <input
                  placeholder="Enter Quantity"
                  type="number"
                  className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <input
                  placeholder="Enter full address"
                  className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  value={measurementUnit}
                  readOnly
                />
              </span>
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
                  onClick={sendEnquiry}
                >
                  Confirm &amp; Proceed
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[300px] md:h-[400px] object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 md:space-y-6"
            >
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <span className="text-gray-500 line-through text-lg md:text-xl">
                  ₹{product.price}
                </span>
                <span className="text-fruit-red text-2xl md:text-3xl font-bold">
                  ₹{discountedPrice}
                </span>
                <span className="bg-fruit-red/10 text-fruit-red px-2 py-1 rounded-full text-xs md:text-sm">
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
              <p className="text-gray-600 text-sm md:text-base">
                {product.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-sm md:text-base">
                <p>
                  <strong>Packaging Type:</strong> Corrugated Boxed Packaging
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
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 flex items-center justify-center"
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
                  <span className="hidden md:inline">Add to Cart</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openModal}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="h-5 w-5" />
                  <span className="hidden md:inline">Send Enquiry</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
          <div className="border-t p-6 md:p-8">
            {reviews_exist && (
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Customer Reviews
              </h2>
            )}
            <div className="space-y-4 md:space-y-6">
              {reviewsList.map((review) =>
                review.product_id === product.id ? (
                  <div key={review.review_id} className="border-b pb-4 md:pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center">
                          {review.user[0]}
                        </div>
                        <span className="font-medium">{review.user}</span>
                      </div>
                      <span className="text-xs md:text-sm text-gray-500">
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
                    <p className="text-gray-800 text-sm md:text-base">
                      {review.comment}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </div>
          <RelatedProducts
            category={product.category}
            currentProductId={Number(id)}
          />
        </div>
      </div>
    </div>
  );
};
