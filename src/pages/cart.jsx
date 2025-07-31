import React, { useEffect, useState } from "react";

const PROVINCES = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
];

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCODModal, setShowCODModal] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [finalBill, setFinalBill] = useState(null);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    country: "",
    province: "",
    district: "",
    homeTown: "",
    phone: "",
  });

  const [card, setCard] = useState({
    cardNumber: "",
    exp: "",
    cvv: "",
    cardHolder: "",
  });

  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "guest",
  };
  const user_id = user?.id || localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return;
    fetch(
      `http://localhost/kaizen-backend/cart/get_cart.php?user_id=${user_id}`
    )
      .then((res) => res.json())
      .then((data) => setCartItems(data.items || []))
      .catch((err) => console.error("Cart load error:", err));
  }, [user_id]);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const removeFromCart = (product_id) => {
    fetch("http://localhost/kaizen-backend/cart/remove_from_cart.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, product_id }),
    }).then(() =>
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== product_id)
      )
    );
  };

  const clearCart = () => {
    fetch("http://localhost/kaizen-backend/cart/clear_cart.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    }).then(() => setCartItems([]));
  };

  const handleOrderSubmit = async (payment_method) => {
    const order = {
      user_id,
      username: user.username,
      phone: address.phone,
      total,
      payment_method,
      delivery_address: address.homeTown,
      province: address.province,
      district: address.district,
    };

    const response = await fetch(
      "http://localhost/kaizen-backend/simulate_payment.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, items: cartItems }),
      }
    );

    const data = await response.json();
    console.log("💬 Payment Response:", data);

    if (data.status === "success") {
      setFinalBill({ ...order, cartItems });
      setOrderConfirm(true);
      clearCart();
    } else {
      setMessage("Order failed: " + (data.message || "unknown error"));
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const valid = Object.values(address).every((v) => v);
    if (!valid) return setMessage("Please fill in all address fields.");
    setShowAddressModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSelect = (type) => {
    setShowPaymentModal(false);
    if (type === "card") setShowCardModal(true);
    else setShowCODModal(true);
  };

  const handleCODConfirm = () => {
    handleOrderSubmit("cod");
    setShowCODModal(false);
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const valid = Object.values(card).every((v) => v);
    if (!valid) return setMessage("Please fill in all card details.");
    handleOrderSubmit("card");
    setShowCardModal(false);
  };

  return (
    <div className="container py-16 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">Your Cart</h1>

      {orderConfirm && finalBill ? (
        <div className="bg-white rounded-xl p-6 shadow animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-pink-600">
            🧾 Final Bill
          </h2>
          <p>
            <strong>Name:</strong> {address.firstName} {address.lastName}
          </p>
          <p>
            <strong>Address:</strong> {address.homeTown}, {address.district},{" "}
            {address.province}, {address.country}
          </p>
          <p>
            <strong>Phone:</strong> {address.phone}
          </p>
          <p>
            <strong>Payment:</strong> {finalBill.payment_method}
          </p>
          <ul className="mt-4">
            {finalBill.cartItems.map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity} = {item.price * item.quantity} LKR
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold text-pink-600">
            Total: {finalBill.total} LKR
          </p>
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg">No items in your cart yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <ul>
            {cartItems.map((item) => (
              <li
                key={item.product_id}
                className="flex items-center gap-4 py-4 border-b"
              >
                <img
                  src={item.image_url}
                  className="w-20 h-20 rounded"
                  alt={item.name}
                />
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p>Qty: {item.quantity}</p>
                  <p className="text-pink-600 font-bold">
                    Price: {item.price} × {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="text-right mt-4">
            <p className="text-lg font-bold">Total: {total} LKR</p>
            <div className="mt-2 space-x-2">
              <button
                className="bg-gray-400 px-4 py-2 text-white rounded"
                onClick={clearCart}
              >
                Clear
              </button>
              <button
                className="bg-pink-600 px-6 py-2 text-white rounded"
                onClick={() => setShowAddressModal(true)}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddressSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-slide-up"
          >
            <h2 className="text-xl font-bold text-pink-600 mb-4">
              Delivery Address
            </h2>
            {Object.entries(address).map(([key, val]) =>
              key !== "province" ? (
                <input
                  key={key}
                  placeholder={key}
                  className="w-full border p-2 mb-2"
                  value={val}
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                />
              ) : (
                <select
                  key={key}
                  className="w-full border p-2 mb-2"
                  value={val}
                  onChange={(e) =>
                    setAddress({ ...address, province: e.target.value })
                  }
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              )
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-pink-600 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-slide-up">
            <h2 className="text-xl font-bold text-pink-600 mb-4">
              Select Payment Method
            </h2>
            <button
              onClick={() => handlePaymentSelect("card")}
              className="bg-blue-500 text-white w-full px-4 py-2 rounded mb-2"
            >
              Pay with Card
            </button>
            <button
              onClick={() => handlePaymentSelect("cod")}
              className="bg-yellow-500 text-black w-full px-4 py-2 rounded"
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleCardSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-slide-up space-y-2"
          >
            <h2 className="text-xl font-bold text-pink-600">Card Details</h2>
            <input
              placeholder="Card Number"
              className="w-full border p-2"
              onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
            />
            <input
              placeholder="Expiry (MM/YY)"
              className="w-full border p-2"
              onChange={(e) => setCard({ ...card, exp: e.target.value })}
            />
            <input
              placeholder="CVV"
              className="w-full border p-2"
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
            />
            <input
              placeholder="Card Holder Name"
              className="w-full border p-2"
              onChange={(e) => setCard({ ...card, cardHolder: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-pink-600 text-white px-4 py-2 rounded"
              >
                Pay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* COD Confirm Modal */}
      {showCODModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm animate-slide-up">
            <h2 className="text-xl font-bold text-pink-600 mb-4">
              Confirm COD Order?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCODModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCODConfirm}
                className="bg-pink-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Animation */}
      {orderConfirm && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="text-center">
            <div className="text-green-600 text-6xl mb-4 animate-bounce">
              ✅
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-700 mb-4">Thank you for your purchase.</p>
            <button
              className="bg-pink-600 text-white px-6 py-2 rounded"
              onClick={() => setOrderConfirm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {message && <p className="te-red-600 mt-4">{message}</p>}
    </div>
  );
}
