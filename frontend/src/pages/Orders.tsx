import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle } from "lucide-react";
import { Order, Product } from "../types";
import { fetchordersbyusername } from "../data/fetchordersbyusername";
import { products } from "../data/products";

// const mockOrders = [
//   {
//     id: "1",
//     date: "2024-03-15",
//     total: 45.99,
//     status: "shipping",
//     items: [
//       { name: "Fresh Strawberries", quantity: 2, price: 4.99 },
//       { name: "Organic Bananas", quantity: 3, price: 2.99 },
//     ],
//   },
//   // Add more mock orders as needed
// ];

export const Orders = () => {
  const [orderlist, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      let username = sessionStorage.getItem("userName");
      const res = await products();
      setItems(res);
      const restwo = await fetchordersbyusername(username);
      setOrders(restwo);
    };
    getProducts();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-5 w-5 text-yellow-500" />;
      case "shipping":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        <div className="space-y-6">
          {orderlist.map((order) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.orderId}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.dateOfOrderPlaced).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.currentStatus)}
                    <span className="text-sm font-medium capitalize">
                      {order.currentStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {order.items.map((item, index) => {
                    const match = item.match(/(.+) \( x (\d+)\)/);
                    let itemName = "";
                    let itemQuantity = 0;
                    if (match) {
                      itemName = match[1].trim();
                      itemQuantity = parseInt(match[2], 10);
                    }
                    const product = items.find((p) => p.name === itemName);
                    let price = 0;
                    if (product) {
                      price = product.price;
                    }
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2"
                      >
                        <div>
                          <p className="font-medium">{itemName}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {itemQuantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₹{(price * itemQuantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">
                    ₹{order.totalOrderAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
