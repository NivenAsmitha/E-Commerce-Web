import React, { useState, useEffect } from "react";
import WomenBanner from "../assets/website/womenbanner.jpg";

export default function Womenwear({ handleAddToCart }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch("http://localhost/kaizen-backend/womenwear_api.php")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize("");
    setQuantity(1);
  };

  const closeModal = () => setSelectedProduct(null);

  const addToCartAndClose = () => {
    if (selectedProduct.sizes && !selectedSize) {
      alert("Please select a size!");
      return;
    }
    handleAddToCart({
      ...selectedProduct,
      size: selectedSize,
      quantity,
    });
    closeModal();
  };

  return (
    <div className="bg-pink-50 dark:bg-gray-950 min-h-screen pb-10">
      {/* Banner */}
      <section className="relative flex items-center justify-center min-h-[220px] md:min-h-[300px] lg:min-h-[340px] bg-gradient-to-tr from-pink-200 via-secondary/40 to-primary/60 mb-12 overflow-hidden shadow-lg rounded-2xl mx-auto w-[98vw] max-w-[1600px]">
        <img
          src={WomenBanner}
          alt="Womenwear Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 via-pink-100/40 to-primary/40 blur-2xl opacity-70"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow mb-4">
            #Women’s Wear
          </h1>
        </div>
      </section>

      {/* Products Section */}
      <section className="container px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-500 text-center mb-10">
          Fashion for Every Occasion
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-4 text-center text-gray-400 text-lg">
              No women’s wear products yet.
              <br />
              (Products will appear here when added by admin.)
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-900 shadow rounded p-4 text-center"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h4 className="mt-2 font-bold">{product.name}</h4>
                <p className="text-pink-500 font-bold">
                  {Number(product.price).toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <button
                  className="mt-2 px-4 py-1 bg-primary text-white rounded"
                  onClick={() => openProduct(product)}
                >
                  Quick View
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Product Modal Popup */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={closeModal}
            >
              ×
            </button>
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <h4 className="text-lg font-bold mb-2">{selectedProduct.name}</h4>
            <p className="text-pink-600 text-xl mb-2">
              {Number(selectedProduct.price).toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              })}
            </p>
            {selectedProduct.sizes && (
              <select
                className="w-full mb-2 border px-2 py-1 rounded"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {(selectedProduct.sizes || "").split(",").map((sz) =>
                  sz ? (
                    <option key={sz.trim()} value={sz.trim()}>
                      {sz.trim()}
                    </option>
                  ) : null
                )}
              </select>
            )}
            <input
              type="number"
              className="w-full mb-2 border px-2 py-1 rounded"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
              className="w-full bg-primary text-white py-2 rounded mt-2"
              onClick={addToCartAndClose}
            >
              Add to Cart
            </button>
            <h4 className="mt-4 font-semibold">Product Details</h4>
            <p>{selectedProduct.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
