import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";

function App() {
  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-950">
      <Navbar />
      <Hero />
      <Products />
      <TopProducts />
      <Banner />
    </div>
  );
}

export default App;
