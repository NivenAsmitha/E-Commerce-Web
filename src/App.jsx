import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import About from "./pages/about";
import Menswear from "./pages/menswear";
import Womenwear from "./pages/womenwear";
import Toprated from "./pages/TopRated";
import Footwear from "./pages/Footwear";
import Caps from "./pages/caps";
import Bag from "./pages/bag";
import Cart from "./pages/Cart";
import AdminPage from "./pages/AdminPage";

function App() {
  const [orderPopup, setOrderPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [role, setRole] = useState(""); // "user" or "admin"

  // Cart logic
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
      <div className="min-h-screen bg-pink-50 dark:bg-gray-950">
        <Navbar setOrderPopup={setOrderPopup} cartItems={cartItems} />
        {/* Pass setRole so popup can set admin/user after login */}
        <Popup
          orderPopup={orderPopup}
          setOrderPopup={setOrderPopup}
          setRole={setRole}
        />
        {successMessage && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50">
            {successMessage}
          </div>
        )}
        <Routes>
          {/* PUBLIC ROUTES */}
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
          {/* PROTECTED ADMIN ROUTE */}
          <Route
            path="/admin"
            element={
              role === "admin" ? <AdminPage /> : <Navigate to="/" replace />
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
