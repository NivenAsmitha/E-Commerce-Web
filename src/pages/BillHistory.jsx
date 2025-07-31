import React, { useEffect, useState } from "react";

export default function BillHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const user_id = user?.id || localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost/kaizen-backend/bills/get_bills.php?user_id=${user_id}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setBills(data.bills);
        } else {
          setError("Failed to fetch bills from server.");
        }
      })
      .catch(() => {
        setError("Failed to fetch bill history.");
      })
      .finally(() => setLoading(false));
  }, [user_id]);

  if (loading) {
    return <p className="p-8 text-gray-500">Loading bill history...</p>;
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">🧾 Bill History</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {bills.length === 0 ? (
        <p className="text-gray-600">No bills found.</p>
      ) : (
        <ul className="space-y-6">
          {bills.map((bill) => (
            <li key={bill.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="mb-4">
                <p>
                  <strong>Order ID:</strong> #{bill.id}
                </p>
                <p>
                  <strong>Total:</strong> {bill.total} LKR
                </p>
                <p>
                  <strong>Payment:</strong> {bill.payment_method}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {bill.created_at
                    ? new Date(bill.created_at).toLocaleString()
                    : "Unknown"}
                </p>
                <p>
                  <strong>To:</strong> {bill.address}, {bill.district},{" "}
                  {bill.province}
                </p>
              </div>

              {bill.items?.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <ul className="text-sm space-y-1">
                    {bill.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{item.price * item.quantity} LKR</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
