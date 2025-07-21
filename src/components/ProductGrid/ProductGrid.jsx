import React, { useState, useEffect } from "react";

export default function ProductGrid({
  fetchUrl,
  bannerImg,
  title,
  subtitle,
  handleAddToCart,
}) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, [fetchUrl]);

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
      {/* Banner with Top Rated size & style */}
      <section className="relative flex items-center justify-center min-h-[220px] md:min-h-[300px] lg:min-h-[340px] bg-gradient-to-tr from-primary/60 via-secondary/40 to-pink-200/70 mb-8 overflow-hidden shadow-lg rounded-2xl mx-auto w-[98vw] max-w-[1600px]">
        <img
          src={bannerImg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-secondary/30 to-pink-100/40 blur-2xl opacity-70"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
            {title}
          </h1>
        </div>
      </section>

      {/* Product grid section */}
      <section className="w-full mx-auto bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-xl px-2 sm:px-6 py-8 mb-10 border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-7">
          {subtitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.length === 0 ? (
            <div className="col-span-4 text-center text-gray-500">
              No products available.
            </div>
          ) : (
            products.map((product, i) => (
              <div
                key={product.id}
                className={`
                  bg-white dark:bg-gray-900 shadow rounded-lg flex flex-col h-full p-3 items-center
                  group hover:shadow-xl transition duration-300 ease-in
                  opacity-0 animate-fadein
                `}
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div className="w-full aspect-[3/4] overflow-hidden rounded mb-2">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-semibold text-sm mb-0.5 truncate w-full text-center">
                  {product.name}
                </h4>
                <div className="text-pink-500 font-bold text-base mb-1">
                  {Number(product.price).toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
                <button
                  className="mt-auto bg-primary px-4 py-1.5 rounded text-white text-sm font-semibold hover:bg-pink-700 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center animate-fadein-fast">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-md w-full relative scale-100 animate-popup">
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

      {/* Animations */}
      <style>
        {`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: none;}
        }
        .animate-fadein {
          animation: fadein 0.6s cubic-bezier(.46,.03,.52,.96) both;
        }
        .animate-fadein-fast {
          animation: fadein 0.3s cubic-bezier(.46,.03,.52,.96) both;
        }
        @keyframes popup {
          from { opacity: 0; transform: scale(.92);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-popup {
          animation: popup 0.28s cubic-bezier(.46,.03,.52,.96) both;
        }
        `}
      </style>
    </div>
  );
}
