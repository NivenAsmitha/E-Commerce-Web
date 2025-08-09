import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function BillHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refs = useRef({});

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const user_id = user?.id || localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) {
      setError("Please log in to view your bill history.");
      setLoading(false);
      return;
    }

    const fetchBills = async () => {
      try {
        const res = await fetch(
          `http://localhost/kaizen-backend/bills/get_bills.php?user_id=${user_id}`
        );
        const data = await res.json();
        if (data.status === "success") {
          setBills(data.bills);
        } else {
          setError(data.message || "No bills found.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [user_id]);

  const handleDownloadPDF = async (billId) => {
    const input = refs.current[billId];
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Bill_${billId}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md animate-pulse">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 mb-4">
            <svg
              className="h-6 w-6 text-pink-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Loading your bills
          </h2>
          <p className="text-gray-500">
            We're gathering your purchase history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Order History
            </h1>
            <p className="text-gray-500 mt-1">
              Review your past purchases and invoices
            </p>
          </div>
          {bills.length > 0 && (
            <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-xs border border-gray-200">
              <svg
                className="w-5 h-5 text-pink-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {bills.length} {bills.length === 1 ? "invoice" : "invoices"}
              </span>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Unable to load bills
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && bills.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              No invoices yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your order history will appear here after you make purchases.
            </p>
          </div>
        )}

        {/* Bills List */}
        {bills.length > 0 && (
          <div className="space-y-5">
            {bills.map((bill) => (
              <div
                key={bill.id}
                ref={(el) => (refs.current[bill.id] = el)}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                {/* Bill Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center">
                      <div className="bg-pink-100 p-2 rounded-lg mr-4">
                        <svg
                          className="w-5 h-5 text-pink-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          Order #{bill.id}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {new Date(bill.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          bill.payment_method === "cod"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {bill.payment_method?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bill Content */}
                <div className="p-6">
                  {/* Contact and Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Address
                      </h3>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>{bill.delivery_address}</p>
                        <p>
                          {bill.province}, {bill.district}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Contact Information
                      </h3>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>{bill.username}</p>
                        <p>{bill.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ordered Items */}
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Ordered Items
                    </h3>
                    {bill.items && bill.items.length > 0 ? (
                      <div className="space-y-4">
                        {bill.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start"
                          >
                            <div className="flex items-start space-x-4">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-800">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-800">
                                {item.price * item.quantity} LKR
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.price} LKR each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm">
                        No items information available
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 mt-6 pt-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Order Total
                        </h4>
                        <p className="text-xs text-gray-500">
                          Including all taxes
                        </p>
                      </div>
                      <p className="text-xl font-bold text-pink-600">
                        {bill.total} LKR
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => handleDownloadPDF(bill.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
                  >
                    <svg
                      className="-ml-1 mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
