import React from "react";
import LOGO from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping, FaCaretDown } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import Darkmood from "./Darkmood";

// Main nav links
const Menu = [
  { id: 1, name: "Home", link: "/#" },
  { id: 2, name: "Top Rated", link: "/#services" },
  { id: 3, name: "Women Wear", link: "/#" },
  { id: 4, name: "Mens Wear", link: "/#" },
  { id: 5, name: "About Us", link: "/#" },
];

// Dropdown links
const DropdownLinks = [
  { id: 1, name: "Trending Products", link: "/#" },
  { id: 2, name: "Best Selling", link: "/#" },
  { id: 3, name: "Top Rated", link: "/#" },
];

const Navbar = ({ setOrderPopup }) => {
  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white">
      {/* Upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container mx-auto flex justify-between items-center py-2">
          {/* Logo and Brand */}
          <a href="#" className="font-bold text-xl flex items-center gap-2">
            <img src={LOGO} alt="Logo" className="w-12" />
            KAIZEN
          </a>
          {/* Search Bar + Order Button + Darkmood + Login */}
          <div className="relative flex items-center gap-2">
            {/* Search Bar */}
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Search"
                className="w-[180px] sm:w-[220px] group-hover:w-[260px] transition-all duration-300 rounded-full border border-gray-300 px-3 py-1 pl-9 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary text-sm"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 left-3 -translate-y-1/2 text-xl pointer-events-none" />
            </div>

            {/* Order Button */}
            <button
              onClick={() => alert("Ordering not available yet")}
              className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
            >
              <span className="group-hover:block hidden transition-all duration-200">
                Order
              </span>
              <FaCartShopping className="text-xl" />
            </button>
            {/* Login Button - MATCHES Order Button */}
            <button
              onClick={() => setOrderPopup(true)}
              className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
              title="Login"
            >
              <span className="group-hover:block hidden transition-all duration-200">
                Login
              </span>
              <FaUserCircle className="text-xl" />
            </button>

            {/* Dark Mode Toggle */}
            <Darkmood />
          </div>
        </div>
      </div>

      {/* Lower Navbar with main links and dropdown */}
      <div className="flex justify-center bg-white dark:bg-gray-900">
        <ul className="sm:flex hidden items-center gap-4">
          {Menu.map((item) => (
            <li key={item.id}>
              <a
                href={item.link}
                className="inline-block px-4 hover:text-primary duration-200"
              >
                {item.name}
              </a>
            </li>
          ))}
          {/* Dropdown Example */}
          <li className="group relative">
            <a href="#" className="flex items-center gap-[2px] py-2">
              Trending
              <span>
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </span>
            </a>
            <div className="absolute z-[9999] hidden group-hover:block w-[170px] rounded-md bg-white p-2 text-black shadow">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                    >
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
