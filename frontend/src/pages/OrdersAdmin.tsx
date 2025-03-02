import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { orders } from "../data/order";
import { Order } from "../types";

export const OrdersAdmin = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [orderlist, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const restwo = await orders();
      setOrders(restwo);
    };
    getProducts();
  }, []);
  const filteredOrders = orderlist.filter((order) => {
    if (filter !== "all" && order.currentStatus !== filter) return false;
    return (
      order.userName.toLowerCase().includes(search.toLowerCase()) ||
      order.orderId.includes(search)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fruit-red"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fruit-red"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="shipping">Shipping</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.orderId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.orderId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order.dateOfOrderPlaced).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.totalOrderAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        {
                          pending: "bg-yellow-100 text-yellow-800",
                          shipping: "bg-blue-100 text-blue-800",
                          delivered: "bg-green-100 text-green-800",
                          cancelled: "bg-red-100 text-red-800",
                        }[order.currentStatus]
                      }`}
                    >
                      {order.currentStatus.charAt(0).toUpperCase() +
                        order.currentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-fruit-red hover:text-fruit-purple">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
