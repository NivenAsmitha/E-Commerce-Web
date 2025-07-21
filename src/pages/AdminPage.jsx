import React, { useEffect, useState } from "react";

const categories = [
  { key: "menswear", label: "Menswear" },
  { key: "womenwear", label: "Womenwear" },
  { key: "bag", label: "Bags" },
  { key: "cap", label: "Caps" },
  { key: "footwear", label: "Footwear" },
];

const backendBase = "http://localhost/kaizen-backend/";

export default function AdminPage() {
  // Product state
  const [currentCategory, setCurrentCategory] = useState(categories[0].key);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    image_url: "",
    sizes: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Support Users
  const [supportUsers, setSupportUsers] = useState([]);
  const [supportForm, setSupportForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [supportError, setSupportError] = useState("");
  const [supportSuccess, setSupportSuccess] = useState("");
  const [editSupport, setEditSupport] = useState(null);
  const [editSupportMsg, setEditSupportMsg] = useState("");

  // Customers
  const [allCustomers, setAllCustomers] = useState([]);
  const [customerMsg, setCustomerMsg] = useState("");

  // Product CRUD
  useEffect(() => {
    setLoading(true);
    fetch(`${backendBase}${currentCategory}_api.php`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [currentCategory]);

  // Support Users
  const fetchSupportUsers = () => {
    fetch(`${backendBase}get_support_users.php`)
      .then((res) => res.json())
      .then(setSupportUsers)
      .catch(() => setSupportUsers([]));
  };
  useEffect(fetchSupportUsers, []);

  // Customers
  const fetchAllCustomers = () => {
    fetch(`${backendBase}get_normal_users.php`)
      .then((res) => res.json())
      .then(setAllCustomers)
      .catch(() => setAllCustomers([]));
  };
  useEffect(fetchAllCustomers, []);

  // --- Product CRUD ---
  const openForm = (product = null) => {
    setError("");
    setShowForm(true);
    setFormData(
      product || {
        id: null,
        name: "",
        description: "",
        price: "",
        image_url: "",
        sizes: "",
      }
    );
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    const url = `${backendBase}${currentCategory}_api.php`;
    const payload = {
      ...formData,
      action: formData.id ? "edit" : "add",
    };
    payload.price = parseFloat(payload.price);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        fetch(url)
          .then((res) => res.json())
          .then((data) => setProducts(data));
        setShowForm(false);
        setSuccessMsg(
          formData.id
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        setTimeout(() => setSuccessMsg(""), 2000);
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError("Failed to save");
    }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    setSuccessMsg("");
    const url = `${backendBase}${currentCategory}_api.php`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSuccessMsg("Product deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 2000);
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert("Failed to delete");
    }
    setLoading(false);
  };

  // --- Support user CRUD ---
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSupportError("");
    setSupportSuccess("");
    const { username, password, email, phone } = supportForm;
    if (!username || !password || !email || !phone) {
      setSupportError("All fields are required.");
      return;
    }
    try {
      const res = await fetch(backendBase + "add_support_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supportForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSupportSuccess("Support user added successfully!");
        setSupportForm({ username: "", password: "", email: "", phone: "" });
        fetchSupportUsers();
        setTimeout(() => setSupportSuccess(""), 2000);
      } else {
        setSupportError(data.error || "Failed to add user.");
      }
    } catch {
      setSupportError("Network error");
    }
  };

  const handleEditSupport = async () => {
    setEditSupportMsg("");
    if (!editSupport.username || !editSupport.email || !editSupport.phone) {
      setEditSupportMsg("All fields required.");
      return;
    }
    try {
      const res = await fetch(`${backendBase}edit_support_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSupport),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditSupportMsg("Saved!");
        setEditSupport(null);
        fetchSupportUsers();
        setTimeout(() => setEditSupportMsg(""), 1200);
      } else {
        setEditSupportMsg(data.error || "Failed to save.");
      }
    } catch {
      setEditSupportMsg("Network error");
    }
  };

  const deleteSupportUser = async (id) => {
    if (!window.confirm("Delete this support user?")) return;
    try {
      const res = await fetch(`${backendBase}delete_support_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSupportUsers();
        setSupportSuccess("Support user deleted successfully!");
        setTimeout(() => setSupportSuccess(""), 2000);
      } else {
        alert(data.error || "Failed to delete.");
      }
    } catch {
      alert("Network error");
    }
  };

  // --- Delete customer user ---
  const deleteCustomerUser = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      const res = await fetch(`${backendBase}delete_customer_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchAllCustomers();
        setCustomerMsg("Customer deleted successfully!");
        setTimeout(() => setCustomerMsg(""), 2000);
      } else {
        alert(data.error || "Failed to delete.");
      }
    } catch {
      alert("Network error");
    }
  };

  // --- Render ---
  return (
    <div className="container py-10 max-w-7xl">
      <h1 className="text-4xl font-extrabold mb-8 text-primary tracking-tight flex items-center gap-3">
        <span>Admin Dashboard</span>
        <span className="text-xs font-semibold text-white bg-pink-500 px-3 py-1 rounded-2xl shadow">
          KAIZEN
        </span>
      </h1>

      {/* Product Management */}
      <section className="mb-14">
        <div className="flex gap-2 mb-5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCurrentCategory(cat.key)}
              className={`px-5 py-2 rounded-full border-2 font-medium shadow-sm transition-all ${
                currentCategory === cat.key
                  ? "bg-primary text-white border-primary scale-105"
                  : "bg-gray-50 dark:bg-gray-800 text-primary border-primary/20 hover:bg-primary/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-pink-600">
            {categories.find((c) => c.key === currentCategory).label} Products
          </h2>
          <button
            className="bg-primary text-white px-5 py-2 rounded-full shadow font-semibold hover:bg-pink-700 transition"
            onClick={() => openForm()}
          >
            Add Product
          </button>
        </div>

        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold shadow">
            {successMsg}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-lg font-medium text-primary">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border mb-6 rounded-xl overflow-hidden shadow">
              <thead>
                <tr className="bg-pink-100 text-primary">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Sizes</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-pink-50">
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.description}</td>
                      <td className="p-2">
                        {Number(p.price).toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td className="p-2">{p.sizes}</td>
                      <td className="p-2">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-10 w-10 object-cover rounded border"
                          />
                        ) : (
                          <span className="italic text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="p-2 flex gap-2">
                        <button
                          className="text-blue-600 underline"
                          onClick={() => openForm(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 underline"
                          onClick={() => deleteProduct(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-6">
                      No products found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <form
              className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow w-full max-w-lg flex flex-col gap-4"
              onSubmit={saveProduct}
            >
              <h2 className="text-xl font-bold mb-3 text-primary">
                {formData.id ? "Edit" : "Add"} Product
              </h2>
              {error && (
                <div className="text-red-500 mb-2 text-center">{error}</div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, price: e.target.value }))
                  }
                  required
                />
              </div>
              <input
                className="border px-3 py-2 rounded"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Sizes (e.g. S,M,L,XL)"
                value={formData.sizes}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, sizes: e.target.value }))
                }
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, image_url: e.target.value }))
                }
              />
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded mx-auto my-2 border"
                />
              )}
              <div className="flex gap-2 mt-3">
                <button className="bg-primary text-white py-2 px-7 rounded shadow font-semibold hover:bg-pink-700 transition">
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-200 text-gray-900 py-2 px-6 rounded shadow font-semibold hover:bg-gray-300 transition"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* --- Customer Support Section --- */}
      <section className="mt-20 border-t-2 pt-10">
        <h2 className="text-2xl font-extrabold mb-5 text-pink-700 flex items-center gap-3">
          <span>Customer Support Users</span>
          <span className="text-xs font-semibold bg-pink-200 px-2 py-1 rounded-xl text-pink-800">
            Support
          </span>
        </h2>
        {/* Add Support Form */}
        <form
          className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-5 rounded-xl shadow max-w-lg mb-8 border border-pink-100"
          onSubmit={handleSupportSubmit}
        >
          {supportError && (
            <div className="text-red-500 font-semibold">{supportError}</div>
          )}
          {supportSuccess && (
            <div className="text-green-600 font-semibold">{supportSuccess}</div>
          )}
          <div className="flex gap-2">
            <input
              className="border px-3 py-2 rounded w-1/4"
              placeholder="Username"
              value={supportForm.username}
              onChange={(e) =>
                setSupportForm((f) => ({ ...f, username: e.target.value }))
              }
              required
            />
            <input
              className="border px-3 py-2 rounded w-1/4"
              placeholder="Password"
              type="password"
              value={supportForm.password}
              onChange={(e) =>
                setSupportForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
            <input
              className="border px-3 py-2 rounded w-1/4"
              placeholder="Email"
              type="email"
              value={supportForm.email}
              onChange={(e) =>
                setSupportForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <input
              className="border px-3 py-2 rounded w-1/4"
              placeholder="Phone"
              value={supportForm.phone}
              onChange={(e) =>
                setSupportForm((f) => ({ ...f, phone: e.target.value }))
              }
              required
            />
          </div>
          <button className="bg-primary text-white py-2 rounded mt-2 self-start px-8 shadow font-semibold hover:bg-pink-700 transition">
            Add Support User
          </button>
        </form>

        {/* List and edit/delete support users */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2 text-pink-800">
            All Support Users
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-900 rounded-xl shadow text-sm">
              <thead>
                <tr className="bg-pink-100 text-primary">
                  <th className="p-2">Username</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supportUsers.length > 0 ? (
                  supportUsers.map((u) =>
                    editSupport && editSupport.id === u.id ? (
                      <tr key={u.id}>
                        <td className="p-2">
                          <input
                            className="border px-1 py-0.5 rounded"
                            value={editSupport.username}
                            onChange={(e) =>
                              setEditSupport((f) => ({
                                ...f,
                                username: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="p-2">
                          <input
                            className="border px-1 py-0.5 rounded"
                            value={editSupport.email}
                            onChange={(e) =>
                              setEditSupport((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="p-2">
                          <input
                            className="border px-1 py-0.5 rounded"
                            value={editSupport.phone}
                            onChange={(e) =>
                              setEditSupport((f) => ({
                                ...f,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="p-2 flex gap-2">
                          <button
                            className="bg-primary text-white px-2 py-1 rounded shadow hover:bg-pink-700 transition"
                            onClick={handleEditSupport}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-200 text-gray-900 px-2 py-1 rounded shadow"
                            onClick={() => setEditSupport(null)}
                          >
                            Cancel
                          </button>
                          {editSupportMsg && (
                            <span className="ml-2 text-green-600 font-semibold">
                              {editSupportMsg}
                            </span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr key={u.id}>
                        <td className="p-2">{u.username}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.phone}</td>
                        <td className="p-2 flex gap-2">
                          <button
                            className="text-blue-600 underline"
                            onClick={() => {
                              setEditSupport(u);
                              setEditSupportMsg("");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 underline"
                            onClick={() => deleteSupportUser(u.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-6">
                      No support users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- All Customers Section --- */}
      <section className="mt-20 border-t-2 pt-10">
        <h2 className="text-2xl font-extrabold mb-5 text-primary">
          All Customers
        </h2>
        {customerMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold shadow">
            {customerMsg}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-900 rounded-xl shadow text-sm">
            <thead>
              <tr className="bg-blue-100 text-primary">
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allCustomers.length > 0 ? (
                allCustomers.map((u) => (
                  <tr key={u.id}>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.phone}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="text-red-600 underline"
                        onClick={() => deleteCustomerUser(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-6">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
