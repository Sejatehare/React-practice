import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCategories } from "../../api/dbAPI";
import ProductCard from "../../components/user/ProductCard";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useLocation } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user?.userId;

  // ✅ Get category from query params (for when user clicks category block)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");

  // ✅ Fetch products & categories
  useEffect(() => {
    (async () => {
      try {
        const p = await fetchProducts();
        setProducts(p);
      } catch (e) {
        console.error(e);
      }
      try {
        const c = await fetchCategories();
        setCats(c);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // ✅ Set category automatically when navigated from HomePage
  useEffect(() => {
    if (categoryFromQuery) setCat(categoryFromQuery);
  }, [categoryFromQuery]);

  // ✅ Load user's wishlist
  useEffect(() => {
    if (!userId) return;
    const wishRef = ref(database, `wishlists/${userId}`);
    const unsubscribe = onValue(wishRef, (snapshot) => {
      const data = snapshot.val();
      setWishlist(data ? Object.values(data) : []);
    });
    return () => unsubscribe();
  }, [userId]);

  // ✅ Filter products
  const filtered = products.filter((pr) => {
    const matchesCat = cat
      ? pr.category?.toLowerCase() === cat.toLowerCase()
      : true;
    const matchesSearch = pr.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 🔍 Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          className="border p-2 rounded w-full"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        >
          <option value="">All Categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🛍️ Product grid or fallback */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              userId={userId}
              wishlist={wishlist}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-600 mt-24 text-xl font-medium animate-fadeIn">
          <p>
            No products found in{" "}
            <span className="text-pink-600 font-semibold">
              {cat || "this selection"}
            </span>
            .
          </p>
          <p className="text-pink-500 font-semibold mt-1">Available Soon 💎</p>
        </div>
      )}
    </div>
  );
}
