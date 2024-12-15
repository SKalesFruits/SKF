import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Settings, Package, LogOut } from "lucide-react";

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const handleLogout = () => {
    // logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50"
        >
          {sessionStorage.getItem("logged_in_user") && (
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">
                {sessionStorage.getItem("logged_in_user")}
              </p>
              <p className="text-xs text-gray-500">
                {sessionStorage.getItem("logged_in_email")}
              </p>
            </div>
          )}

          <div className="py-1">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
            <Link
              to="/orders"
              onClick={onClose}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Package className="h-4 w-4 mr-2" />
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
