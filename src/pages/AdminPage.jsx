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

  // Fetch products for the selected category
  useEffect(() => {
    setLoading(true);
    fetch(`${backendBase}${currentCategory}_api.php`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [currentCategory]);

  // Open add or edit modal
  const openForm = (product = null) => {
    setError("");
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        price: "",
        image_url: "",
        sizes: "",
      });
    }
    setShowForm(true);
  };

  // Add or Edit product
  const saveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
        // Refresh product list
        fetch(url)
          .then((res) => res.json())
          .then((data) => setProducts(data));
        setShowForm(false);
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError("Failed to save");
    }
    setLoading(false);
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
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
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert("Failed to delete");
    }
    setLoading(false);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>
      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCurrentCategory(cat.key)}
            className={`px-4 py-2 rounded mb-2 ${
              currentCategory === cat.key
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {categories.find((c) => c.key === currentCategory).label} Products
        </h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => openForm()}
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border mb-6">
            <thead>
              <tr className="bg-pink-100">
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
                  <tr key={p.id}>
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.description}</td>
                    <td className="p-2">{p.price}</td>
                    <td className="p-2">{p.sizes}</td>
                    <td className="p-2">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="p-2">
                      <button
                        className="text-blue-600 mr-2"
                        onClick={() => openForm(p)}
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
            className="bg-white dark:bg-gray-900 p-6 rounded shadow w-96 flex flex-col gap-3"
            onSubmit={saveProduct}
          >
            <h2 className="text-xl font-bold mb-3">
              {formData.id ? "Edit" : "Add"} Product
            </h2>
            {error && (
              <div className="text-red-500 mb-2 text-center">{error}</div>
            )}
            <input
              className="border px-3 py-2 rounded"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
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
              placeholder="Price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((f) => ({ ...f, price: e.target.value }))
              }
              required
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
                className="h-16 w-16 object-cover rounded mx-auto my-2 border"
              />
            )}
            <button className="bg-primary text-white py-2 rounded mt-2">
              Save
            </button>
            <button
              type="button"
              className="text-gray-600"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
