import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Apple, Menu, X, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { AnnouncementBar } from "./AnnouncementBar";
import { UserProfileDropdown } from "./UserProfileDropdown";
import LogoTwo from "./logotwo.png";
// import LogoTwo from "./finallogo.png";
import "./nav.css";
import axios, { AxiosResponse } from "axios";
import { UserDetails } from "../types";

export const Navbar = () => {
  const { state } = useCart();
  const [authenticated, setUserAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => matchPath(path, location.pathname);
  const links = [
    { path: "/", label: "Home" },
    { path: "/impex", label: "Impex" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact Us" },
    isAdmin ? { path: "/admin", label: "Admin" } : null, // Return `null` instead of an empty object
  ].filter(Boolean); // Remove `null` values

  useEffect(() => {
    const check_admin_status = async () => {
      const response: AxiosResponse<UserDetails> = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/admincheck`,
        {
          username: sessionStorage.getItem("logged_in_user"),
        }
      );
      setIsAdmin(response.data.is_admin);
    };
    console.log(sessionStorage.getItem("logged_in_user"));
    if (sessionStorage.getItem("logged_in_user") !== null) {
      setUserAuthenticated(true);
      check_admin_status();
    }
  }, []);
  console.log(authenticated);
  return (
    <div className="fixed top-0 w-full z-50">
      <AnnouncementBar />
      <nav className="bg-[#f77f00] backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              ></motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#FFFFFF] to-[#000000] bg-clip-text text-transparent">
                {/* <img src={Logo} id="logo-gr"></img> */}
                {/* <img src={LogoOne} id="logo-gr"></img> */}
                <img src={LogoTwo} id="logo-gr"></img>
                {/* <p>
                  <span>Grow</span>
                  <span>फल</span>
                </p> */}
              </span>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#FFFFFF] hover:text-[#FFFFFF] transition-colors"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {links.map(
                (link) =>
                  link !== null && (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="relative group"
                    >
                      <span
                        className={`text-white hover:text-[#FFFFFF] transition-colors ${
                          location.pathname === link.path
                            ? "text-[#FFFFFF]"
                            : "text-[#FFFFFF]"
                        }`}
                      >
                        {link.label}
                      </span>
                      {location.pathname === link.path && (
                        <motion.div
                          layoutId="underline"
                          className="absolute left-0 right-0 h-0.5 bg-[#FFF200] bottom-0"
                        />
                      )}
                    </Link>
                  )
              )}
              <Link to="/cart" className="relative">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <ShoppingCart className="h-6 w-6 text-white hover:text-white:600 transition-colors" />
                  <AnimatePresence>
                    {state.items.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-[#ffffff] text-[#F77F00] rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      >
                        {state.items.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-[#FFFFFF] hover:text-[#FFFFFF] transition-colors"
                >
                  {authenticated ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-b border-t border-x">
                      <span className="text-[#FFFFFF] font-medium">
                        {sessionStorage.getItem("userName") === null
                          ? sessionStorage.getItem("logged_in_user")?.charAt(0)
                          : sessionStorage.getItem("userName")?.charAt(0)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <p onClick={() => navigate("/signup")}>Sign In</p>
                    </div>
                  )}
                </button>
                <UserProfileDropdown
                  authenticatedFlag={authenticated}
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-2 space-y-1">
                {links.map(
                  (link) =>
                    link !== null && (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          location.pathname === link.path
                            ? "text-[#FFFFFF] bg-[#000000]"
                            : "text-gray-600 hover:text-[#ffffff] hover:bg-[#000000]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                )}
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/cart")
                      ? "text-[#FFFFFF] bg-[#000000]"
                      : "text-gray-600 hover:text-[#000000] hover:bg-[#FFFFFF]"
                  }`}
                >
                  Cart ({state.items.length})
                </Link>
                {authenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#FFFFFF] hover:bg-[#000000]"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#FFFFFF] hover:bg-[#000000]"
                    >
                      My Orders
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#FFFFFF] hover:bg-[#000000
                    ]"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};
