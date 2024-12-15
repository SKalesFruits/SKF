import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Package, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Revenue', value: '$12,345', icon: DollarSign, change: '+12.3%' },
  { label: 'Active Orders', value: '23', icon: Package, change: '+5.4%' },
  { label: 'Total Products', value: '156', icon: BarChart3, change: '+2.1%' },
  { label: 'Delivery Agents', value: '12', icon: Users, change: '0%' },
];

export const Dashboard = () => {
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
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
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
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order}234</p>
                  <p className="text-sm text-gray-600">2 items • $123.45</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  Processing
                </span>
              </div>
            ))}
          </div>
          <Link to="/admin/orders" className="text-fruit-red hover:text-fruit-purple mt-4 inline-block">
            View all orders →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4" />
                  <div>
                    <p className="font-medium">Product {item}</p>
                    <p className="text-sm text-gray-600">5 units left</p>
                  </div>
                </div>
                <Link to="/admin/inventory" className="text-fruit-red hover:text-fruit-purple">
                  Restock
                </Link>
              </div>
            ))}
          </div>
          <Link to="/admin/inventory" className="text-fruit-red hover:text-fruit-purple mt-4 inline-block">
            View inventory →
          </Link>
        </div>
      </div>
    </div>
  );
};