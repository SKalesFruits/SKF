import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus } from "lucide-react";
import { DeliveryAgent } from "../types";

const mockAgents: DeliveryAgent[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "(555) 123-4567",
    status: "available",
    activeOrders: [],
    completedOrders: 150,
  },
  // Add more mock agents as needed
];

export const DeliveryTeam = () => {
  const [search, setSearch] = useState("");

  const filteredAgents = mockAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Delivery Team Management</h1>
        <button className="bg-fruit-red text-white px-4 py-2 rounded-lg hover:bg-fruit-purple transition-colors flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-1">Total Agents</h3>
          <p className="text-2xl font-bold">{mockAgents.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-1">Available Agents</h3>
          <p className="text-2xl font-bold">
            {mockAgents.filter((a) => a.status === "available").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-1">Active Deliveries</h3>
          <p className="text-2xl font-bold">
            {mockAgents.reduce(
              (acc, curr) => acc + curr.activeOrders.length,
              0
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-1">Completed Today</h3>
          <p className="text-2xl font-bold">24</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fruit-red"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {agent.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.email}</div>
                    <div className="text-sm text-gray-500">{agent.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        agent.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {agent.status.charAt(0).toUpperCase() +
                        agent.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.activeOrders.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.completedOrders}
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
