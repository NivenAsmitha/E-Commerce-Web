import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import About from "./pages/about"; // About page (case must match your filename!)
import Menswear from "./pages/menswear"; // Menswear page (use capital M!)
import Womenwear from "./pages/womenwear";
import Services from "./pages/services";

function App() {
  const [orderPopup, setOrderPopup] = useState(false);
  const handleOrderPopup = () => setOrderPopup(true);

  return (
    <Router>
      <div className="min-h-screen bg-pink-50 dark:bg-gray-950">
        <Navbar setOrderPopup={setOrderPopup} />
        <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero handleOrderPopup={handleOrderPopup} />
                <Products />
                <TopProducts handleOrderPopup={handleOrderPopup} />
                <Banner />
                <Subscribe />
                <Testimonials />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/menswear" element={<Menswear />} />
          <Route path="/womenwear" element={<Womenwear />} />
          <Route path="/services" element={<Services />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
