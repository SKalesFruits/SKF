import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Package,
  Coins,
  Users,
  IndianRupeeIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Order, Product } from "../types";
import { products } from "../data/products";
import { orders } from "../data/order";

export const Dashboard = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [orderlist, setOrders] = useState<Order[]>([]);
  const [totalrevenueAmount, setrevenueAmount] = useState<number>(0);
  const [totalProfitAmount, setprofitAmount] = useState<number>(0);
  useEffect(() => {
    const getProducts = async () => {
      const res = await products();
      setItems(res);
      const restwo = await orders();
      setOrders(restwo);
      calculateOrderStats(res, restwo);
    };
    getProducts();
  }, []);

  const calculateOrderStats = (products: Product[], orders: Order[]) => {
    let totalOrderAmount = 0;
    let totalProfit = 0;

    orders.forEach((order) => {
      totalOrderAmount += order.totalOrderAmount;

      order.items.forEach((item) => {
        const match = item.match(/(.+) \( x (\d+)\)/);
        if (match) {
          const itemName = match[1].trim();
          const itemQuantity = parseInt(match[2], 10);

          const product = products.find((p) => p.name === itemName);
          if (product) {
            totalProfit +=
              (product.price - product.buying_price) * itemQuantity;
          }
        }
      });
    });
    setrevenueAmount(totalOrderAmount);
    setprofitAmount(parseInt(totalProfit.toFixed(2)));
  };

  const stats = [
    {
      label: "Total Revenue",
      value: totalrevenueAmount,
      icon: IndianRupeeIcon,
      change: "+12.3%",
    },
    {
      label: "Active Orders",
      value: orderlist.length,
      icon: Package,
      change: "+5.4%",
    },
    {
      label: "Total Products",
      value: items.length,
      icon: BarChart3,
      change: "+2.1%",
    },
    {
      label: "Total Profit",
      value: totalProfitAmount,
      icon: Coins,
      change: "0%",
    },
  ];
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-fruit-red/10 p-3 rounded-lg">
                <stat.icon className="h-6 w-6 text-fruit-red" />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {orderlist.map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                title={String(order.items.map((erer) => erer))}
              >
                <div>
                  <p className="font-medium">
                    Order {order.orderId} | {order.orderLocation}
                  </p>
                  <p className="text-sm text-gray-600">
                    <p>
                      {order?.items ? order.items.length : 0} items | ₹
                      {order?.totalOrderAmount ? order.totalOrderAmount : 0}
                    </p>
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {order.currentStatus}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/admin/orders"
            className="text-fruit-red hover:text-fruit-purple mt-4 inline-block"
          >
            View all orders →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
          <div className="space-y-4">
            {items
              .filter((item) => item.stock && item.stock < 5)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4">
                      <img src={item.image}></img>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.stock} units left
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/admin/inventory"
                    className="text-fruit-red hover:text-fruit-purple"
                  >
                    Restock
                  </Link>
                </div>
              ))}
          </div>
          <Link
            to="/admin/inventory"
            className="text-fruit-red hover:text-fruit-purple mt-4 inline-block"
          >
            View inventory →
          </Link>
        </div>
      </div>
    </div>
  );
};
