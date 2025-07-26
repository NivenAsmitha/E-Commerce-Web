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

  // Support state
  const [supportUsers, setSupportUsers] = useState([]);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportForm, setSupportForm] = useState({
    id: null,
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [supportError, setSupportError] = useState("");
  const [supportSuccess, setSupportSuccess] = useState("");

  // Customers
  const [allCustomers, setAllCustomers] = useState([]);
  const [customerMsg, setCustomerMsg] = useState("");

  // --- Product CRUD ---
  useEffect(() => {
    setLoading(true);
    fetch(`${backendBase}${currentCategory}_api.php`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [currentCategory]);

  // --- Support ---
  const fetchSupportUsers = () => {
    fetch(`${backendBase}get_support_users.php`)
      .then((res) => res.json())
      .then(setSupportUsers)
      .catch(() => setSupportUsers([]));
  };
  useEffect(fetchSupportUsers, []);

  // --- Customers ---
  const fetchAllCustomers = () => {
    fetch(`${backendBase}get_normal_users.php`)
      .then((res) => res.json())
      .then(setAllCustomers)
      .catch(() => setAllCustomers([]));
  };
  useEffect(fetchAllCustomers, []);

  // --- Product modal open ---
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

  // --- Support modal open ---
  const openSupportForm = (supportUser = null) => {
    setSupportError("");
    setSupportSuccess("");
    setShowSupportForm(true);
    setSupportForm(
      supportUser
        ? { ...supportUser, password: "" } // Don’t show old password on edit
        : { id: null, username: "", password: "", email: "", phone: "" }
    );
  };

  // --- Product handlers ---
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

  // --- Support user handlers ---
  const saveSupportUser = async (e) => {
    e.preventDefault();
    setSupportError("");
    setSupportSuccess("");
    const { id, username, password, email, phone } = supportForm;
    if (!username || (!id && !password) || !email || !phone) {
      setSupportError("All fields are required.");
      return;
    }
    try {
      const actionUrl = id
        ? backendBase + "edit_support_user.php"
        : backendBase + "add_support_user.php";
      const body = { ...supportForm };
      if (!id) delete body.id;
      if (!body.password) delete body.password; // Don't send empty password on edit
      const res = await fetch(actionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSupportSuccess(
          id ? "Support user updated successfully!" : "Support user added!"
        );
        setShowSupportForm(false);
        fetchSupportUsers();
        setSupportForm({
          id: null,
          username: "",
          password: "",
          email: "",
          phone: "",
        });
        setTimeout(() => setSupportSuccess(""), 2000);
      } else {
        setSupportError(data.error || "Failed to save user.");
      }
    } catch {
      setSupportError("Network error");
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

  // --- Customers ---
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
    <div className="container py-8 max-w-7xl">
      {/* --- Products Section --- */}
      <section className="mb-16">
        <div className="flex gap-3 mb-7 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCurrentCategory(cat.key)}
              className={`px-5 py-2 rounded-full border-2 font-semibold shadow-sm transition-all ${
                currentCategory === cat.key
                  ? "bg-primary text-white border-primary scale-105"
                  : "bg-pink-50 text-primary border-pink-200 hover:bg-pink-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="mb-5 flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-primary">
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
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="w-full bg-white dark:bg-gray-900 rounded-xl text-sm">
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
                    <tr key={p.id} className="hover:bg-pink-50 transition">
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.description}</td>
                      <td className="p-2 text-pink-700">
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

        {/* Product Modal */}
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
                  setFormData((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
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
                  className="bg-pink-100 text-primary py-2 px-6 rounded shadow font-semibold hover:bg-pink-200 transition"
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
      <section className="mb-20">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-extrabold text-pink-700">
            Customer Support Users
          </h2>
          <button
            className="bg-pink-600 text-white px-5 py-2 rounded-full shadow font-semibold hover:bg-pink-800 transition"
            onClick={() => openSupportForm()}
          >
            Add Support User
          </button>
        </div>
        {supportSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold shadow">
            {supportSuccess}
          </div>
        )}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="w-full bg-white dark:bg-gray-900 rounded-xl text-sm">
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
                supportUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-pink-50 transition">
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.phone}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="text-blue-600 underline"
                        onClick={() => openSupportForm(u)}
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
                ))
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

        {/* Support Modal */}
        {showSupportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <form
              className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow w-full max-w-lg flex flex-col gap-4"
              onSubmit={saveSupportUser}
            >
              <h2 className="text-xl font-bold mb-3 text-pink-700">
                {supportForm.id ? "Edit" : "Add"} Support User
              </h2>
              {supportError && (
                <div className="text-red-500 mb-2 text-center">
                  {supportError}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Username"
                  value={supportForm.username}
                  onChange={(e) =>
                    setSupportForm((f) => ({ ...f, username: e.target.value }))
                  }
                  required
                />
                <input
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Email"
                  type="email"
                  value={supportForm.email}
                  onChange={(e) =>
                    setSupportForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Phone"
                  value={supportForm.phone}
                  onChange={(e) =>
                    setSupportForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                />
                {/* Only require password on add */}
                <input
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Password"
                  type="password"
                  value={supportForm.password}
                  onChange={(e) =>
                    setSupportForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required={!supportForm.id}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button className="bg-pink-600 text-white py-2 px-7 rounded shadow font-semibold hover:bg-pink-800 transition">
                  Save
                </button>
                <button
                  type="button"
                  className="bg-pink-100 text-primary py-2 px-6 rounded shadow font-semibold hover:bg-pink-200 transition"
                  onClick={() => setShowSupportForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* --- Customers Section --- */}
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold mb-5 text-primary">
          All Customers
        </h2>
        {customerMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold shadow">
            {customerMsg}
          </div>
        )}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="w-full bg-white dark:bg-gray-900 rounded-xl text-sm">
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
                  <tr key={u.id} className="hover:bg-blue-50 transition">
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
