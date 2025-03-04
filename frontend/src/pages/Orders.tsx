import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle } from "lucide-react";
import { Order, Product } from "../types";
import { fetchordersbyusername } from "../data/fetchordersbyusername";
import { products } from "../data/products";
import axios from "axios";
import toast from "react-hot-toast";

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
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order>({
    orderId: "",
    userName: "",
    dateOfOrderPlaced: "",
    currentStatus: "",
    orderLocation: "",
    orderAddress: "",
    totalOrderAmount: 0,
    items: [],
    fleetAssignedId: null,
    fleetAssignedName: null,
    reason: "",
  });
  const [items, setItems] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  useEffect(() => {
    const getProducts = async () => {
      let username = localStorage.getItem("userName");
      if (username === null) {
        username = localStorage.getItem("logged_in_user");
      }
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

  const handleCancelOrder = async (order_id: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cancelorder`,
        {
          reason: reason,
          orderId: order_id,
        }
      );
      console.log(response.data);
      toast.success(`Order Cancelled`, {
        duration: 5000,
        position: "top-right",
        style: { background: "#4287f5", color: "#fff" },
        icon: "❗",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isWithin24Hours = (dateOfOrderPlaced: string): boolean => {
    const orderDate = new Date(dateOfOrderPlaced);
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate.getTime() - orderDate.getTime();

    // Convert 24 hours to milliseconds
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

    return timeDifference <= twentyFourHoursInMs;
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
            <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-2xl w-96 backdrop-filter backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Cancel Your Order {selectedOrderToCancel.orderId}
              </h2>
              <div className="border-t pt-4">
                {selectedOrderToCancel.items.map((item, index) => {
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
              <textarea
                placeholder="Enter reason for cancellation"
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold hover:disabled:cursor-not-allowed"
                  disabled={reason === ""}
                  title={reason === "" ? "Write a reason for cancellation" : ""}
                  onClick={() =>
                    handleCancelOrder(selectedOrderToCancel.orderId)
                  }
                >
                  Cancel your order
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
        <div className="space-y-6">
          {orderlist.length > 0 ? (
            orderlist
              .sort((a, b) =>
                a.dateOfOrderPlaced < b.dateOfOrderPlaced ? 1 : -1
              )
              .map((order) => (
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
                          {new Date(
                            order.dateOfOrderPlaced
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 justify-between">
                        {getStatusIcon(order.currentStatus)}
                        <span className="text-sm font-medium capitalize">
                          {order.currentStatus}
                        </span>
                        {order.currentStatus === "pending" &&
                        isWithin24Hours(order.dateOfOrderPlaced) ? (
                          <button
                            onClick={() => {
                              setSelectedOrderToCancel(order);
                              setIsModalOpen(true);
                            }}
                            className="bg-red-500 text-white px-1 py-1 rounded"
                          >
                            Cancel Order
                          </button>
                        ) : (
                          <></>
                        )}
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
              ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden h-48 justify-center flex items-center">
              No past Orders for you
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
