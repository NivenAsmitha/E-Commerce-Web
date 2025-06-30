import React from "react";
import LOGI from "../../assets/logo.png"; // Adjust the path as necessary

const Navbar = () => {
  return (
    <div>
      {/* Upper Navbar */}
      <div class className="bg bg-primary/40 py-3">
        <div className="container mx-auto flex justify-between items-center py-4    ">
          <a href="#" className="font-bold text-xl flex items-center gap-2">
            <img src={LOGI} alt="Logo" className="w-10" />
            shopsy
          </a>
        </div>
        <div>
          {/* Search Bar and Oder Button */}
          <div className="group">
            <input
              type="text"
              placeholder="Search"
              className="w-[200px] sm:w[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
              Order
            </button>
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
      <div></div>
    </div>
  );
};

export default Navbar;
