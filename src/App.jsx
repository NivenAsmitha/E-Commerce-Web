import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import About from "./pages/about";
import Menswear from "./pages/menswear";
import Womenwear from "./pages/womenwear";
import Toprated from "./pages/toprated";
import Footwear from "./pages/footwear";
import Caps from "./pages/caps";
import Bag from "./pages/bag";
import Cart from "./pages/cart";
import AdminPage from "./pages/AdminPage";
import SupportChat from "./pages/SupportChat";
import SupportDashboard from "./pages/SupportDashboard";

function App() {
  const [orderPopup, setOrderPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [role, setRole] = useState(""); // "user", "admin", or "support"
  const [user, setUser] = useState(null); // { id, username }

  // Save login to localStorage
  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [role, user]);

  // Load login from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("user");
    if (savedRole) setRole(savedRole);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const isLoggedIn = !!user;

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setSuccessMessage("Item added to cart!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };
  const removeFromCart = (removeIdx) =>
    setCartItems((prev) => prev.filter((_, idx) => idx !== removeIdx));
  const clearCart = () => setCartItems([]);

  return (
    <Router>
      <Navbar
        setOrderPopup={setOrderPopup}
        username={user?.username}
        role={role}
        setRole={setRole}
        setUsername={(username) => setUser((u) => ({ ...u, username }))}
        cartItems={cartItems}
      />
      <Popup
        orderPopup={orderPopup}
        setOrderPopup={setOrderPopup}
        setRole={setRole}
        setUsername={(username) => setUser((u) => ({ ...u, username }))}
        role={role}
      />
      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}

      <Routes>
        {/* Public Home */}
        <Route
          path="/"
          element={
            <>
              <Hero isLoggedIn={isLoggedIn} setOrderPopup={setOrderPopup} />
              <Products
                handleAddToCart={handleAddToCart}
                isLoggedIn={isLoggedIn}
                setOrderPopup={setOrderPopup}
              />
              <TopProducts
                handleAddToCart={handleAddToCart}
                isLoggedIn={isLoggedIn}
                setOrderPopup={setOrderPopup}
              />
              <Banner isLoggedIn={isLoggedIn} setOrderPopup={setOrderPopup} />
              <Subscribe
                isLoggedIn={isLoggedIn}
                setOrderPopup={setOrderPopup}
              />
              <Testimonials
                isLoggedIn={isLoggedIn}
                setOrderPopup={setOrderPopup}
              />
            </>
          }
        />
        {/* Protected: About */}
        <Route
          path="/about"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <About />
            </ProtectedRoute>
          }
        />
        {/* Product categories */}
        <Route
          path="/menswear"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Menswear handleAddToCart={handleAddToCart} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/womenwear"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Womenwear handleAddToCart={handleAddToCart} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/toprated"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Toprated />
            </ProtectedRoute>
          }
        />
        <Route
          path="/footwear"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Footwear handleAddToCart={handleAddToCart} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/caps"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Caps handleAddToCart={handleAddToCart} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bag"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Bag handleAddToCart={handleAddToCart} />
            </ProtectedRoute>
          }
        />
        {/* Cart */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            </ProtectedRoute>
          }
        />
        {/* Support Chat (for users) */}
        <Route
          path="/support-chat"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn && role === "user"}>
              <SupportChat userId={user?.id} />
            </ProtectedRoute>
          }
        />
        {/* Support Dashboard (for support users) */}
        <Route
          path="/support"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn && role === "support"}>
              <SupportDashboard supportId={user?.id} />
            </ProtectedRoute>
          }
        />
        {/* Admin Page */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isLoggedIn={role === "admin"}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
