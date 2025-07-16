import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Popup from "./components/Popup/Popup";
import Footer from "./components/Footer/Footer";
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

function App() {
  const [orderPopup, setOrderPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [role, setRole] = useState(""); // "user" or "admin"
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
    if (username) localStorage.setItem("username", username);
    else localStorage.removeItem("username");
  }, [role, username]);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedUsername = localStorage.getItem("username");
    if (savedRole) setRole(savedRole);
    if (savedUsername) setUsername(savedUsername);
  }, []);

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
        username={username}
        role={role}
        setRole={setRole}
        setUsername={setUsername}
        cartItems={cartItems}
      />
      <Popup
        orderPopup={orderPopup}
        setOrderPopup={setOrderPopup}
        setRole={setRole}
        setUsername={setUsername}
      />
      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Products handleAddToCart={handleAddToCart} />
              <TopProducts handleAddToCart={handleAddToCart} />
              <Banner />
              <Subscribe />
              <Testimonials />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/menswear"
          element={<Menswear handleAddToCart={handleAddToCart} />}
        />
        <Route
          path="/womenwear"
          element={<Womenwear handleAddToCart={handleAddToCart} />}
        />
        <Route path="/toprated" element={<Toprated />} />
        <Route path="/footwear" element={<Footwear />} />
        <Route path="/caps" element={<Caps />} />
        <Route path="/bag" element={<Bag />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />
        <Route
          path="/admin"
          element={
            role === "admin" ? <AdminPage /> : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
