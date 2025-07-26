import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Popup = ({ orderPopup, setOrderPopup, setRole, setUsername }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      phone: "",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = isLogin
      ? "http://localhost/kaizen-backend/login.php"
      : "http://localhost/kaizen-backend/register.php";

    const payload = isLogin
      ? {
          username: formData.username,
          password: formData.password,
        }
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      if (isLogin) {
        if (!data.role || !data.username)
          throw new Error("User role or username not found");
        setRole(data.role);
        setUsername(data.username);
        setOrderPopup(false);
        resetForm();
        // ===== THE ONLY CHANGE YOU NEEDED IS THIS 👇👇👇
        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "support") {
          navigate("/support");
        } else {
          navigate("/");
        }
      } else {
        alert("Registration successful. Please log in.");
        setIsLogin(true);
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Login/Register failed");
    }
  };

  if (!orderPopup) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={() => {
        setOrderPopup(false);
        resetForm();
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-[90%] max-w-sm mx-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-2xl text-gray-700 dark:text-white hover:text-red-500"
          onClick={() => {
            setOrderPopup(false);
            resetForm();
          }}
        >
          <IoMdClose />
        </button>

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

        <h2 className="text-xl font-semibold mb-5 text-center text-gray-900 dark:text-gray-100">
          {isLogin ? "User Login" : "User Registration"}
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium dark:text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full text-gray-900 dark:text-gray-100"
          />
          {!isLogin && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full text-gray-900 dark:text-gray-100"
              />
            </>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-full text-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-full hover:scale-105 transition-transform duration-200"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
