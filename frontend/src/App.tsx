import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FruitBackground } from "./components/FruitBackground";
import { Chatbot } from "./components/Chatbot";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { About } from "./pages/About";
import { Login } from "./auth/Login";
import { Signup } from "./auth/Signup";
import { Dashboard } from "./pages/admin/Dashboard";
import { Inventory } from "./pages/admin/Inventory";
import { Orders } from "./pages/admin/Orders";
import { Orders as OrderProfile } from "./pages/Orders";
import { DeliveryTeam } from "./pages/admin/DeliveryTeam";
import { ShippingPolicy } from "./components/ShippingPolicy";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { RefundPolicy } from "./components/RefundPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { Profile } from "./pages/Profile";

export const App = () => {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50/80 flex flex-col">
          <FruitBackground />
          <Navbar />
          <main className="flex-grow mt-[104px]">
            {" "}
            {/* Adjusted margin to account for announcement bar */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<OrderProfile />} />
              <Route path="/admin/inventory" element={<Inventory />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/delivery" element={<DeliveryTeam />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </CartProvider>
    </Router>
  );
};

export default App;
