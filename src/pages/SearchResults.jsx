import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function SearchResults({ handleAddToCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(
      `http://localhost/kaizen-backend/search_products.php?q=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Search Results for: <span className="text-pink-600">{query}</span>
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200 text-gray-700 font-medium"
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg text-gray-600">
            No products found for "{query}"
          </p>
          <p className="text-gray-500">
            Try different keywords or browse our categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((item) => (
            <div
              key={`${item.category}-${item.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <Link
                to={`/${item.category}/${item.id}`}
                className="block overflow-hidden"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h2 className="font-bold text-lg mb-1 text-gray-800 line-clamp-2">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 mb-2 text-sm">
                    {item.description?.substring(0, 60)}...
                  </p>
                  <p className="text-lg font-bold text-pink-600 mb-3">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center text-sm text-blue-600 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <Link
                      to={`/${item.category}`}
                      className="hover:underline hover:text-blue-800"
                    >
                      {item.category.charAt(0).toUpperCase() +
                        item.category.slice(1)}
                    </Link>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
