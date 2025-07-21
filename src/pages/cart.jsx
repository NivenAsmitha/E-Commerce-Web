import React, { useState } from "react";

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

export default function Cart({ cartItems, removeFromCart, clearCart }) {
  const [showAddress, setShowAddress] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showCOD, setShowCOD] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState(false);
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
  const [message, setMessage] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  // Address Form Validation
  const isAddressValid =
    address.firstName.trim() &&
    address.lastName.trim() &&
    address.country.trim() &&
    address.province.trim() &&
    address.district.trim() &&
    address.homeTown.trim() &&
    address.phone.trim();

  // Card Form Validation
  const isCardValid =
    card.cardNumber.trim() &&
    card.exp.trim() &&
    card.cvv.trim() &&
    card.cardHolder.trim();

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

  // Start Checkout
  const startCheckout = () => setShowAddress(true);

  // After Address Submit
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

  // After Payment Method Select
  const handlePaymentSelect = (type) => {
    setShowPayment(false);
    setMessage("");
    if (type === "COD") {
      setShowCOD(true);
    } else {
      setShowCard(true);
    }
  };

  // COD Confirm
  const handleCODConfirm = () => {
    setShowCOD(false);
    setOrderConfirm(true);
    clearCart && clearCart();
  };

  // Card Payment Submit
  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!isCardValid) {
      setMessage("Please fill all card details.");
      return;
    }
    setShowCard(false);
    setOrderConfirm(true);
    clearCart && clearCart();
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
            {cartItems.map((item, idx) => (
              <li
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b last:border-0"
              >
                <img
                  src={item.image_url || item.img || item.image}
                  alt={item.name || item.title}
                  className="w-24 h-24 object-cover rounded shadow"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg">
                    {item.name || item.title}
                  </h3>
                  {item.size && (
                    <p>
                      Size: <span className="font-semibold">{item.size}</span>
                    </p>
                  )}
                  <p>
                    Qty: <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p className="text-pink-500 font-bold">
                    Price: $
                    {Number(item.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {item.quantity > 1 && <> x {item.quantity}</>}
                  </p>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded shadow"
                  onClick={() => removeFromCart(idx)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-end mt-6 gap-3">
            <span className="text-lg font-bold text-primary">
              Total: $
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <button
              className="mt-2 bg-primary text-white font-bold px-6 py-2 rounded shadow"
              onClick={startCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* ADDRESS POPUP */}
      {showAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={closeAll}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-primary text-center">
              Shipping Address
            </h2>
            {message && (
              <div className="text-red-500 mb-2 text-center">{message}</div>
            )}
            <form
              onSubmit={handleAddressSubmit}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                className="border px-3 py-2 rounded"
                placeholder="First Name"
                value={address.firstName}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, firstName: e.target.value }))
                }
                required
              />
              <input
                type="text"
                className="border px-3 py-2 rounded"
                placeholder="Last Name"
                value={address.lastName}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, lastName: e.target.value }))
                }
                required
              />
              <input
                type="text"
                className="border px-3 py-2 rounded"
                placeholder="Country"
                value={address.country}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, country: e.target.value }))
                }
                required
              />
              <select
                className="border px-3 py-2 rounded"
                value={address.province}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, province: e.target.value }))
                }
                required
              >
                <option value="">Select Province</option>
                {PROVINCES.map((prov) => (
                  <option key={prov}>{prov}</option>
                ))}
              </select>
              <input
                type="text"
                className="border px-3 py-2 rounded"
                placeholder="District"
                value={address.district}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, district: e.target.value }))
                }
                required
              />
              <input
                type="text"
                className="border px-3 py-2 rounded"
                placeholder="Home Town"
                value={address.homeTown}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, homeTown: e.target.value }))
                }
                required
              />
              <input
                type="text"
                className="border px-3 py-2 rounded"
                placeholder="Phone Number"
                value={address.phone}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, phone: e.target.value }))
                }
                required
              />
              <button
                type="submit"
                className="bg-primary text-white font-bold py-2 rounded mt-2"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT OPTION POPUP */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={closeAll}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-primary text-center">
              Select Payment Method
            </h2>
            <div className="flex flex-col gap-4">
              <button
                className="bg-primary text-white font-bold py-2 rounded"
                onClick={() => handlePaymentSelect("COD")}
              >
                Cash on Delivery
              </button>
              <button
                className="bg-primary text-white font-bold py-2 rounded"
                onClick={() => handlePaymentSelect("CARD")}
              >
                Card Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COD POPUP */}
      {showCOD && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={closeAll}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-primary text-center">
              Cash on Delivery
            </h2>
            <p className="mb-4 text-center text-yellow-600 font-semibold">
              You have to pay courier charges on delivery.
            </p>
            <button
              className="bg-primary text-white font-bold py-2 rounded px-6"
              onClick={handleCODConfirm}
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* CARD PAYMENT POPUP */}
      {showCard && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={closeAll}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-primary text-center">
              Card Details
            </h2>
            {message && (
              <div className="text-red-500 mb-2 text-center">{message}</div>
            )}
            <form onSubmit={handleCardSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                className="border px-3 py-2 rounded"
                placeholder="Card Number"
                value={card.cardNumber}
                onChange={(e) =>
                  setCard((c) => ({ ...c, cardNumber: e.target.value }))
                }
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-1/2"
                  placeholder="MM/YY"
                  value={card.exp}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, exp: e.target.value }))
                  }
                  required
                />
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-1/2"
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, cvv: e.target.value }))
                  }
                  required
                />
              </div>
              <input
                type="text"
                className="border px-3 py-2 rounded"
                placeholder="Cardholder Name"
                value={card.cardHolder}
                onChange={(e) =>
                  setCard((c) => ({
                    ...c,
                    cardHolder: e.target.value,
                  }))
                }
                required
              />
              <button
                type="submit"
                className="bg-primary text-white font-bold py-2 rounded mt-2"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION */}
      {orderConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={closeAll}
            >
              ×
            </button>
            <h3 className="text-2xl text-green-600 font-bold mb-3">
              Order Confirmed!
            </h3>
            <p className="text-center">
              Thank you, {address.firstName}!<br />
              Your order has been placed and will be delivered soon.
            </p>
            <button
              className="mt-5 bg-primary text-white px-4 py-2 rounded"
              onClick={closeAll}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
