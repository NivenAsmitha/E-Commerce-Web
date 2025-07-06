import React, { useState } from "react";

const initialProducts = [
  { id: 1, name: "Men's Shirt", price: 40, category: "menswear" },
  { id: 2, name: "Women's Dress", price: 60, category: "womenwear" },
  // Add demo products or fetch from backend/localStorage
];

const initialOrders = [
  {
    id: 1,
    customer: "John Doe",
    total: 120,
    date: "2025-07-03",
    status: "Pending",
    address: "Colombo, Western Province",
    items: [{ name: "Men's Shirt", qty: 2 }],
  },
  // Add demo orders
];

export default function AdminPage() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);

  // For adding/editing a product
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  // --- Product Handlers ---
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", category: "" });
    setShowProductForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };

  const saveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category)
      return;
    if (editingProduct) {
      // Edit
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...editingProduct, ...productForm } : p
        )
      );
    } else {
      // Add
      setProducts((prev) => [...prev, { ...productForm, id: Date.now() }]);
    }
    setShowProductForm(false);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // --- Reports (demo) ---
  const today = new Date().toISOString().slice(0, 10);
  const dailyOrders = orders.filter((o) => o.date === today);
  const weeklyOrders = orders; // In demo, just all
  const monthlyOrders = orders; // In demo, just all

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setTab("products")}
          className={tab === "products" ? "font-bold underline" : ""}
        >
          Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={tab === "orders" ? "font-bold underline" : ""}
        >
          Orders
        </button>
        <button
          onClick={() => setTab("reports")}
          className={tab === "reports" ? "font-bold underline" : ""}
        >
          Reports
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <div>
          <button
            className="mb-4 bg-primary text-white px-4 py-2 rounded"
            onClick={openAddProduct}
          >
            Add Product
          </button>
          <table className="w-full border">
            <thead>
              <tr className="bg-pink-100">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Category</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => openEditProduct(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Product Form Modal */}
          {showProductForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <form
                className="bg-white p-6 rounded shadow w-80 flex flex-col gap-3"
                onSubmit={saveProduct}
              >
                <h2 className="text-xl font-bold mb-3">
                  {editingProduct ? "Edit" : "Add"} Product
                </h2>
                <input
                  className="border px-3 py-2 rounded"
                  placeholder="Name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="border px-3 py-2 rounded"
                  placeholder="Price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, price: e.target.value }))
                  }
                  required
                />
                <input
                  className="border px-3 py-2 rounded"
                  placeholder="Category"
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, category: e.target.value }))
                  }
                  required
                />
                <button className="bg-primary text-white py-2 rounded mt-2">
                  Save
                </button>
                <button
                  type="button"
                  className="text-gray-600"
                  onClick={() => setShowProductForm(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === "orders" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Orders</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-pink-100">
                <th className="p-2">ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Total</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Address</th>
                <th className="p-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-2">{o.id}</td>
                  <td className="p-2">{o.customer}</td>
                  <td className="p-2">${o.total}</td>
                  <td className="p-2">{o.date}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">{o.address}</td>
                  <td className="p-2">
                    {o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORTS TAB */}
      {tab === "reports" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Reports</h2>
          <div className="mb-3">
            <h3 className="font-bold">Daily Orders</h3>
            <div>Orders today: {dailyOrders.length}</div>
          </div>
          <div className="mb-3">
            <h3 className="font-bold">Weekly Orders</h3>
            <div>Orders this week: {weeklyOrders.length}</div>
          </div>
          <div>
            <h3 className="font-bold">Monthly Orders</h3>
            <div>Orders this month: {monthlyOrders.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
