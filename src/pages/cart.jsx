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
  const [showAddress, setShowAddress] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showCOD, setShowCOD] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState(false);
  const [message, setMessage] = useState("");

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

  const user_id = localStorage.getItem("user_id");

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
    })
      .then((res) => res.json())
      .then(() => {
        setCartItems((prev) =>
          prev.filter((item) => item.product_id !== product_id)
        );
      });
  };

  const clearCart = () => {
    fetch("http://localhost/kaizen-backend/cart/clear_cart.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    })
      .then((res) => res.json())
      .then(() => setCartItems([]));
  };

  const isAddressValid =
    address.firstName &&
    address.lastName &&
    address.country &&
    address.province &&
    address.district &&
    address.homeTown &&
    address.phone;

  const isCardValid =
    card.cardNumber && card.exp && card.cvv && card.cardHolder;

  const closeAll = () => {
    setShowAddress(false);
    setShowPayment(false);
    setShowCard(false);
    setShowCOD(false);
    setOrderConfirm(false);
    setAddress({
      firstName: "",
      lastName: "",
      country: "",
      province: "",
      district: "",
      homeTown: "",
      phone: "",
    });
    setCard({
      cardNumber: "",
      exp: "",
      cvv: "",
      cardHolder: "",
    });
    setMessage("");
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!isAddressValid) {
      setMessage("Please fill all address details.");
      return;
    }
    setShowAddress(false);
    setShowPayment(true);
    setMessage("");
  };

  const handlePaymentSelect = (type) => {
    setShowPayment(false);
    setMessage("");
    if (type === "COD") setShowCOD(true);
    else setShowCard(true);
  };

  const handleCODConfirm = () => {
    setShowCOD(false);
    setOrderConfirm(true);
    clearCart();
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!isCardValid) {
      setMessage("Please fill all card details.");
      return;
    }
    setShowCard(false);
    setOrderConfirm(true);
    clearCart();
    setMessage("");
  };

  return (
    <div className="container py-16 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-primary">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-gray-500 text-lg">No items in your cart yet.</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <ul>
            {cartItems.map((item) => (
              <li
                key={item.product_id}
                className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b last:border-0"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded shadow"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  {item.size && (
                    <p>
                      Size: <span className="font-semibold">{item.size}</span>
                    </p>
                  )}
                  <p>
                    Qty: <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p className="text-pink-500 font-bold">
                    Price: ${Number(item.price).toFixed(2)}
                    {item.quantity > 1 && <> × {item.quantity}</>}
                  </p>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded shadow"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-end mt-6 gap-3">
            <span className="text-lg font-bold text-primary">
              Total: ${total.toFixed(2)}
            </span>
            <div className="flex gap-2">
              <button
                className="bg-gray-400 text-white font-bold px-4 py-2 rounded"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="bg-primary text-white font-bold px-6 py-2 rounded shadow"
                onClick={() => setShowAddress(true)}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address, Payment, Card, COD and Confirmation Modals */}
      {/* You already have these in your original — they work fine */}
    </div>
  );
}
