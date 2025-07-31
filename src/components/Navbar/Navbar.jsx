import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import Darkmood from "./Darkmood";

const Menu = [
  { id: 1, name: "Home", type: "page", link: "/" },
  { id: 2, name: "Top Rated", type: "page", link: "/toprated" },
  { id: 3, name: "Women Wear", type: "page", link: "/womenwear" },
  { id: 4, name: "Mens Wear", type: "page", link: "/menswear" },
  { id: 5, name: "About Us", type: "page", link: "/about" },
];

const DropdownLinks = [
  { id: 1, name: "Foot Wear", type: "page", link: "/footwear" },
  { id: 2, name: "Hats & Caps", type: "page", link: "/caps" },
  { id: 3, name: "Bags", type: "page", link: "/bag" },
];

const Navbar = ({
  setOrderPopup,
  username,
  role,
  setRole,
  setUsername,
  cartItems = [],
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole("");
    setUsername("");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white">
      {/* Upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container mx-auto flex justify-between items-center py-2">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <img src={LOGO} alt="Logo" className="w-12" />
            KAIZEN
          </Link>
          <div className="relative flex items-center gap-3">
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Search"
                className="w-[180px] sm:w-[220px] group-hover:w-[260px] transition-all duration-300 rounded-full border border-gray-300 px-3 py-1 pl-9 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary text-sm"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 left-3 -translate-y-1/2 text-xl pointer-events-none" />
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group relative"
              title="Cart"
            >
              <span className="group-hover:block hidden transition-all duration-200">
                Order
              </span>
              <FaCartShopping className="text-xl" />
              {cartItems && cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
            {username ? (
              <>
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-2xl text-primary" />
                  <span className="font-semibold text-primary whitespace-nowrap">
                    {username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-2 ml-2 font-semibold shadow"
                  title="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setOrderPopup(true)}
                className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-2 group"
                title="Login"
              >
                <FaUserCircle className="text-xl" />
                <span>Login</span>
              </button>
            )}
            <Darkmood />
          </div>
        </div>
      </div>
      {/* Lower Navbar */}
      <div className="flex justify-center bg-white dark:bg-gray-900">
        <ul className="sm:flex hidden items-center gap-4">
          {Menu.map((item) => (
            <li key={item.id}>
              {item.type === "page" ? (
                <Link
                  to={item.link}
                  className={`inline-block px-4 hover:text-primary duration-200 ${
                    location.pathname === item.link
                      ? "text-pink-500 font-bold"
                      : ""
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  href={item.link}
                  className="inline-block px-4 hover:text-primary duration-200"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
          <li className="group relative">
            <a href="#" className="flex items-center gap-[2px] py-2">
              Other Accessory
              <span>▼</span>
            </a>
            <div className="absolute z-[9999] hidden group-hover:block w-[170px] rounded-md bg-white p-2 text-black shadow">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <Link
                      to={data.link}
                      className={`inline-block w-full rounded-md p-2 hover:bg-primary/20 ${
                        location.pathname === data.link
                          ? "text-pink-500 font-bold"
                          : ""
                      }`}
                    >
                      {data.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          {role === "admin" && (
            <li>
              <Link
                to="/admin"
                className={`inline-block px-4 hover:text-primary duration-200 ${
                  location.pathname === "/admin"
                    ? "text-pink-500 font-bold"
                    : ""
                }`}
              >
                Admin Dashboard
              </Link>
            </li>
          )}
          {role === "support" && (
            <li>
              <Link
                to="/support"
                className={`inline-block px-4 hover:text-primary duration-200 ${
                  location.pathname === "/support"
                    ? "text-pink-500 font-bold"
                    : ""
                }`}
              >
                Support Dashboard
              </Link>
            </li>
          )}
          {role === "user" && (
            <li>
              <Link
                to="/bills"
                className={`inline-block px-4 hover:text-primary duration-200 ${
                  location.pathname === "/bills"
                    ? "text-pink-500 font-bold"
                    : ""
                }`}
              >
                🧾 Bill History
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
