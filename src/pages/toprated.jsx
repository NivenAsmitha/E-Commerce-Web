import React, { useEffect, useState, useMemo } from "react";
import TopRatedBanner from "../assets/website/topratedbanner.jpg";

// Change this if your backend URL is different:
const BACKEND_BASE = "http://localhost/kaizen-backend";
const API_URL = `${BACKEND_BASE}/get_best_selling.php`;

// Optional: prepend backend to relative image paths from DB
const withBase = (src) => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  return `${BACKEND_BASE}/${src.replace(/^\/+/, "")}`;
};

export default function TopRated() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch(API_URL)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        // Ensure it’s an array
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error("TopRated fetch error:", e);
        if (isMounted) setErr("Could not load best-selling products.");
      })
      .finally(() => isMounted && setLoading(false));
    return () => {
      isMounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="text-center text-gray-400 text-lg">Loading...</div>
      );
    }
    if (err) {
      return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg px-4 py-10 text-center">
          <div className="text-red-500 font-semibold">{err}</div>
          <div className="text-gray-400 mt-2 text-sm">
            Make sure <code>get_best_selling.php</code> is reachable and tables
            match your schema.
          </div>
        </div>
      );
    }
    if (!products.length) {
      return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg px-4 py-10 text-center">
          <div className="text-gray-400 text-lg">No top products yet.</div>
          <div className="text-gray-400 text-sm">
            (They’ll appear here once there are sales.)
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={withBase(p.image)}
              alt={p.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/600x400?text=No+Image";
              }}
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg line-clamp-2">{p.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {typeof p.price === "number"
                    ? `$${p.price.toFixed(2)}`
                    : `$${Number(p.price || 0).toFixed(2)}`}
                </span>
                <span className="text-sm text-gray-400">
                  Sold: {p.total_sold ?? 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [loading, err, products]);

  return (
    <div className="bg-pink-50 dark:bg-gray-950 min-h-screen pb-10">
      {/* Banner */}
      <section className="relative flex items-center justify-center min-h-[220px] md:min-h-[300px] lg:min-h-[340px] bg-gradient-to-tr from-primary/60 via-secondary/40 to-pink-200/70 mb-12 overflow-hidden shadow-lg rounded-2xl mx-auto w-[98vw] max-w-[1600px]">
        <img
          src={TopRatedBanner}
          alt="Top Rated Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-secondary/30 to-pink-100/40 blur-2xl opacity-70"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow mb-4">
            #Top Rated
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="container px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-500 text-center mb-10">
          Best Sellers (Auto)
        </h2>
        {content}
      </section>
    </div>
  );
}
