import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Popup = ({ orderPopup, setOrderPopup, setRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({ username: "", password: "", email: "", address: "" });
    setError("");
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // TODO: Replace with real backend auth call
    if (!formData.username || !formData.password) {
      setError("Please enter username and password");
      return;
    }
    try {
      // Replace the URL with your real backend endpoint!
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      if (!res.ok) {
        throw new Error("Invalid username or password");
      }
      const data = await res.json();
      if (!data.role) {
        setError("User role not found");
        return;
      }
      setRole(data.role); // "admin" or "user"
      setOrderPopup(false);
      resetForm();
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError("Registration not implemented here.");
    // For demo, registration is not implemented
  };

  if (!orderPopup) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={() => {
        setOrderPopup(false);
        resetForm();
        setError("");
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-[90%] max-w-sm mx-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-2xl text-gray-700 dark:text-white hover:text-red-500"
          onClick={() => {
            setOrderPopup(false);
            resetForm();
            setError("");
          }}
        >
          <IoCloseOutline />
        </button>

        {/* Toggle Login/Register */}
        <div className="flex justify-center mb-5 gap-4">
          <button
            onClick={() => {
              setIsLogin(true);
              resetForm();
            }}
            className={`px-4 py-2 rounded-full font-semibold ${
              isLogin
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              resetForm();
            }}
            className={`px-4 py-2 rounded-full font-semibold ${
              !isLogin
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-5 text-center text-gray-900 dark:text-gray-100">
          {isLogin ? "User Login" : "User Registration"}
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mb-4 text-center font-medium dark:text-red-400">
            {error}
          </p>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={formData.username}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-full hover:scale-105 transition-transform duration-200"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            {/* Role Field (Read Only) */}
            <input
              type="text"
              name="role"
              value="user"
              disabled
              className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-200 text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={formData.username}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-full hover:scale-105 transition-transform duration-200"
              disabled
            >
              Register (Not implemented)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Popup;
