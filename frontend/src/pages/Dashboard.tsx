import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, Coins, IndianRupeeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Order, Product, StatsData } from "../types";
import { products } from "../data/products";
import { orders } from "../data/order";
import axios from "axios";
import { getConfigDetailsFromDB } from "../data/config";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [orderlist, setOrders] = useState<Order[]>([]);
  const [totalrevenueAmount, setrevenueAmount] = useState<number>(0);
  const [totalProfitAmount, setprofitAmount] = useState<number>(0);
  const [statsdata, setStats] = useState<StatsData | null>(null);
  const [videoId_yt, setvideoId_yt] = useState<any>("");
  const [postId_Ig, setpostId_Ig] = useState<any>("");
  const [newslettersData, setNewsLettersData] = useState<Array<string>>([]);
  useEffect(() => {
    const getProducts = async () => {
      const res = await products();
      setItems(res);
      const restwo = await orders();
      setOrders(restwo);
      calculateOrderStats(res, restwo);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/statsprevious`
      );
      setStats(response.data);
      const details = await getConfigDetailsFromDB();
      setvideoId_yt(details.find((item) => item.config_name === "videoId_yt"));
      setpostId_Ig(details.find((item) => item.config_name === "postId_Ig"));
      const responsetwo = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/getnewsletters`
      );
      setNewsLettersData(responsetwo.data);
    };
    getProducts();
  }, []);
  console.log(newslettersData);
  const copyToClipboard = async (text: string) => {
    console.log(text);
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
      toast.success(`Copied Successfully`, {
        duration: 5000,
        position: "top-right",
        style: { background: "#4287f5", color: "#fff" },
        icon: "📜",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const handleConfigUpdate = async (platform: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/updateconfig`,
        {
          config_name: platform === "Youtube" ? "videoId_yt" : "postId_Ig",
          config_value: platform === "Youtube" ? videoId_yt : postId_Ig,
        }
      );
      console.log(response.data);
      toast.success(`${platform} ID Updated`, {
        duration: 5000,
        position: "top-right",
        style: { background: "#4287f5", color: "#fff" },
        icon: "▶️",
      });
    } catch (error) {
      console.error(error);
    }
  };

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
      change: String(statsdata?.totalRevenueChange),
    },
    {
      label: "Active Orders",
      value: orderlist.length,
      icon: Package,
      change: String(statsdata?.activeOrdersChange),
    },
    {
      label: "Total Products",
      value: items.length,
      icon: BarChart3,
      change: String(statsdata?.totalProductsChange),
    },
    {
      label: "Total Profit",
      value: totalProfitAmount,
      icon: Coins,
      change: String(statsdata?.totalProfitChange),
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Link Embeddings Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Link Embeddings</h2>
          <div className="space-y-4">
            {["Youtube", "Instagram"].map((platform) => (
              <div
                key={platform}
                className="flex flex-col md:flex-row items-center gap-4"
              >
                <label className="w-full md:w-24 text-left md:text-right">
                  {platform}
                </label>
                <input
                  className="w-full flex-1 border border-gray-300 rounded-md px-3 py-2"
                  value={
                    platform === "Youtube"
                      ? videoId_yt.config_value
                      : postId_Ig.config_value
                  }
                  onChange={(e) =>
                    platform === "Youtube"
                      ? setvideoId_yt(e.target.value)
                      : setpostId_Ig(e.target.value)
                  }
                />
                <button
                  className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
                  onClick={() => handleConfigUpdate(platform)}
                >
                  Submit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Copy My Email Address</h2>
          <div className="space-y-4">
            <button
              className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
              onClick={() => copyToClipboard("impex@growphal.com")}
            >
              Copy
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">
            Copy Customer Email Addresses
          </h2>
          <div className="space-y-4">
            <button
              className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
              onClick={() => copyToClipboard(newslettersData.join(";"))}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {orderlist.map((order) => (
              <Link to={"/admin/orders"}>
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
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.currentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.currentStatus === "shipping"
                        ? "bg-blue-100 text-blue-800"
                        : order.currentStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.currentStatus === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.currentStatus}
                  </span>
                </div>
              </Link>
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
            {items.map((item) => (
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
