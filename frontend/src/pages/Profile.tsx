import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

export const Profile = () => {
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {/* <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    full_name: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fruit-red focus:border-transparent"
              /> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {/* <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fruit-red focus:border-transparent"
              /> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              {/* <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fruit-red focus:border-transparent"
              /> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              {/* <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fruit-red focus:border-transparent"
              /> */}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-fruit-red text-white py-2 rounded-lg hover:bg-fruit-purple transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};
