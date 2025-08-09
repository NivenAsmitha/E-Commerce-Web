// AdminPage.jsx
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";

const categories = [
  { key: "menswear", label: "Menswear" },
  { key: "womenwear", label: "Womenwear" },
  { key: "bag", label: "Bags" },
  { key: "cap", label: "Caps" },
  { key: "footwear", label: "Footwear" },
];

const backendBase = "http://localhost/kaizen-backend/";

export default function AdminPage() {
  const [currentSection, setCurrentSection] = useState("product");
  const [currentCategory, setCurrentCategory] = useState("menswear");
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    image_url: "",
    sizes: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [supportUsers, setSupportUsers] = useState([]);
  const [supportForm, setSupportForm] = useState({
    id: null,
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [allCustomers, setAllCustomers] = useState([]);
  const [reportType, setReportType] = useState("daily");
  const [salesReport, setSalesReport] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ title: "" });

  useEffect(() => {
    if (currentSection === "product") fetchProducts();
    if (currentSection === "support") fetchSupportUsers();
    if (currentSection === "users") fetchAllCustomers();
    if (currentSection === "reports") fetchReport();
  }, [currentSection, currentCategory, reportType]);

  const fetchProducts = () => {
    fetch(`${backendBase}${currentCategory}_api.php`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  };

  const fetchSupportUsers = () => {
    fetch(`${backendBase}get_support_users.php`)
      .then((res) => res.json())
      .then(setSupportUsers)
      .catch(() => setSupportUsers([]));
  };

  const fetchAllCustomers = () => {
    fetch(`${backendBase}get_normal_users.php`)
      .then((res) => res.json())
      .then(setAllCustomers)
      .catch(() => setAllCustomers([]));
  };

  const fetchReport = () => {
    fetch(`${backendBase}admin/get_sales_report.php?type=${reportType}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sales report");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setSalesReport(data);
        } else {
          console.error("Unexpected data:", data);
          setSalesReport([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setSalesReport([]);
      });
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const payload = { ...formData, action: formData.id ? "edit" : "add" };
    payload.price = parseFloat(payload.price);
    const res = await fetch(`${backendBase}${currentCategory}_api.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      fetchProducts();
      setShowForm(false);
      setFormData({
        id: null,
        name: "",
        description: "",
        price: "",
        image_url: "",
        sizes: "",
      });
    } else {
      alert("Failed to save product.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(`${backendBase}${currentCategory}_api.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    const data = await res.json();
    if (data.success) fetchProducts();
  };

  const saveSupportUser = async (e) => {
    e.preventDefault();
    const { id } = supportForm;
    const url = id
      ? `${backendBase}edit_support_user.php`
      : `${backendBase}add_support_user.php`;
    const payload = { ...supportForm };
    if (!id) delete payload.id;
    if (!payload.password) delete payload.password;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      fetchSupportUsers();
      setSupportForm({
        id: null,
        username: "",
        password: "",
        email: "",
        phone: "",
      });
    } else {
      alert("Failed to save support user");
    }
  };

  const deleteSupportUser = async (id) => {
    if (!window.confirm("Delete support user?")) return;
    await fetch(`${backendBase}delete_support_user.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchSupportUsers();
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete customer?")) return;
    await fetch(`${backendBase}delete_user.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAllCustomers();
  };

  const downloadReportPDF = async () => {
    const canvas = await html2canvas(document.getElementById("sales-report"));
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 190, 0);
    pdf.save(`${reportType}-sales-report.pdf`);
  };

  const addEvent = () => {
    if (!eventForm.title.trim()) return;
    setEvents((prev) => [
      ...prev,
      { title: eventForm.title, date: selectedDate },
    ]);
    setEventForm({ title: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["product", "users", "support", "reports", "calendar"].map(
          (key, i) => (
            <button
              key={key}
              onClick={() => setCurrentSection(key)}
              className={`px-5 py-2 rounded-full font-semibold transition shadow ${
                currentSection === key
                  ? "bg-pink-600 text-white"
                  : "bg-pink-100 hover:bg-pink-200"
              }`}
            >
              {
                [
                  "Add Product",
                  "Show Users",
                  "Support Users",
                  "Sales Report",
                  "Events",
                ][i]
              }
            </button>
          )
        )}
      </div>

      {/* Product Section */}
      {currentSection === "product" && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-pink-700">
            Product Management
          </h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCurrentCategory(cat.key)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  cat.key === currentCategory
                    ? "bg-pink-600 text-white"
                    : "bg-pink-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded shadow"
            >
              + Add Product
            </button>
          </div>
          <table className="w-full bg-white text-sm shadow rounded-xl">
            <thead>
              <tr className="bg-pink-100">
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-pink-50">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => {
                        setFormData(p);
                        setShowForm(true);
                      }}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showForm && (
            <form
              onSubmit={saveProduct}
              className="bg-white p-6 rounded-xl shadow space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="border px-3 py-2 rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Name"
                />
                <input
                  className="border px-3 py-2 rounded"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="Price"
                />
                <input
                  className="border px-3 py-2 rounded"
                  value={formData.sizes}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, sizes: e.target.value }))
                  }
                  placeholder="Sizes"
                />
                <input
                  className="border px-3 py-2 rounded"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, image_url: e.target.value }))
                  }
                  placeholder="Image URL"
                />
              </div>
              <textarea
                className="border px-3 py-2 rounded w-full"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Description"
              />
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border"
                />
              )}
              <div className="flex justify-end gap-3">
                <button className="bg-green-600 text-white px-5 py-2 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Show Users Section */}
      {currentSection === "users" && (
        <section>
          <h2 className="text-xl font-bold text-pink-700 mb-4">
            All Customers
          </h2>
          <table className="w-full bg-white text-sm shadow rounded-xl">
            <thead>
              <tr className="bg-blue-100">
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allCustomers.map((u) => (
                <tr key={u.id}>
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteCustomer(u.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Support Users Section */}
      {currentSection === "support" && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-pink-700">Support Users</h2>
          <form
            onSubmit={saveSupportUser}
            className="bg-pink-50 p-4 rounded flex flex-wrap gap-3"
          >
            <input
              className="border px-3 py-2 rounded flex-1"
              value={supportForm.username}
              onChange={(e) =>
                setSupportForm((f) => ({ ...f, username: e.target.value }))
              }
              placeholder="Username"
            />
            <input
              className="border px-3 py-2 rounded flex-1"
              value={supportForm.email}
              onChange={(e) =>
                setSupportForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="Email"
            />
            <input
              className="border px-3 py-2 rounded flex-1"
              value={supportForm.phone}
              onChange={(e) =>
                setSupportForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="Phone"
            />
            <input
              className="border px-3 py-2 rounded flex-1"
              value={supportForm.password}
              onChange={(e) =>
                setSupportForm((f) => ({ ...f, password: e.target.value }))
              }
              type="password"
              placeholder="Password"
              required={!supportForm.id}
            />
            <button className="bg-green-600 text-white px-5 py-2 rounded">
              Save
            </button>
          </form>
          <table className="w-full text-sm bg-white shadow rounded-xl">
            <thead>
              <tr className="bg-pink-100">
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {supportUsers.map((s) => (
                <tr key={s.id}>
                  <td className="p-2">{s.username}</td>
                  <td className="p-2">{s.email}</td>
                  <td className="p-2">
                    <button
                      onClick={() => setSupportForm(s)}
                      className="text-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSupportUser(s.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* === REPORTS SECTION === */}
      {currentSection === "reports" && (
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-xl font-bold text-pink-700">Sales Report</h2>
            <div className="flex flex-wrap gap-2">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button
                onClick={downloadReportPDF}
                className="bg-pink-600 text-white px-4 py-2 rounded"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-4 shadow">
              <div className="text-xs text-gray-500">Total Revenue</div>
              <div className="text-2xl font-semibold">
                Rs.
                {salesReport
                  .reduce((sum, r) => sum + Number(r.total), 0)
                  .toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <div className="text-xs text-gray-500">Total Orders</div>
              <div className="text-2xl font-semibold">{salesReport.length}</div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <div className="text-xs text-gray-500">Items Sold</div>
              <div className="text-2xl font-semibold">
                {salesReport.reduce((sum, r) => sum + Number(r.quantity), 0)}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-4 rounded-xl shadow">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={salesReport.map((r) => ({
                  date: dayjs(r.date).format("MMM D"),
                  revenue: Number(r.total),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs.${value}`} />
                <Bar dataKey="revenue" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div
            id="sales-report"
            className="bg-white p-4 rounded-xl shadow overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-pink-100">
                  <th>Date</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {salesReport.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{r.date}</td>
                    <td className="p-2">{r.product_name}</td>
                    <td className="p-2">{r.quantity}</td>
                    <td className="p-2">Rs.{r.total}</td>
                  </tr>
                ))}
                {!salesReport.length && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {/* Calendar Section */}
      {currentSection === "calendar" && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-pink-700">Event Calendar</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded-xl shadow border p-4 w-full md:w-auto text-center"
            />
            <div className="flex-1">
              <input
                value={eventForm.title}
                onChange={(e) => setEventForm({ title: e.target.value })}
                placeholder="Event Title"
                className="border px-4 py-2 rounded w-full mb-2"
              />
              <button
                onClick={addEvent}
                className="bg-pink-600 text-white px-4 py-2 rounded shadow"
              >
                Add Event
              </button>
              <ul className="mt-4 list-disc pl-6">
                {events
                  .filter(
                    (e) =>
                      new Date(e.date).toDateString() ===
                      selectedDate.toDateString()
                  )
                  .map((e, i) => (
                    <li key={i}>{e.title}</li>
                  ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
