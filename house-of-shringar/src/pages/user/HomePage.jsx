import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCategories } from "../../api/dbAPI";

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // ✅ Default images for different categories (you can replace URLs with your own)
  const defaultImages = {
    rings: "https://png.pngtree.com/thumb_back/fh260/background/20230715/pngtree-d-rendering-of-a-glossy-background-featuring-a-two-diamond-gold-image_3867619.jpg",
    necklace: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29sZCUyMGpld2VsbGVyeXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000",
    earrings: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw9aded0fd/images/hi-res/515090DAEAGA00_1.jpg?sw=480&sh=480",
    bracelets: "https://images.unsplash.com/photo-1612214086305-7e8a9c9dc65c?auto=format&fit=crop&w=900&q=80",
    payal: "https://www.newsx.com/wp-content/uploads/2025/07/242.jpg",
    bangles: "https://images.unsplash.com/photo-1622396483592-89bdfb0f5983?auto=format&fit=crop&w=900&q=80",
    watches: "https://images.unsplash.com/photo-1612817159949-46e7f77d7b4d?auto=format&fit=crop&w=900&q=80",
  };

  // For categories not listed above → fallback rotation
  const fallbackImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1616401784845-180b1b037c3b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1599649094882-17fa6b6a44db?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1612214086305-7e8a9c9dc65c?auto=format&fit=crop&w=900&q=80",
  ];

  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
          Welcome, {user.email?.split("@")?.[0] || "Guest"}!
        </h2>
        <p className="text-gray-600 mb-6">
          Discover our trendy & classic jewelry collection
        </p>
        <Link
          to="/user/products"
          className="bg-pink-500 text-white px-6 py-3 rounded shadow hover:bg-pink-600 transition"
        >
          Browse All Products
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {categories.map((cat, index) => {
          const fallbackImage =
            defaultImages[cat.name] ||
            fallbackImages[index % fallbackImages.length];

          return (
            <div
              key={cat.id}
              className="relative group h-[60vh] rounded-2xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition duration-500"
              onClick={() =>
                navigate(`/user/products?category=${encodeURIComponent(cat.name)}`)
              }
            >
              <img
                src={cat.image || fallbackImage}
                alt={cat.name}
                className="w-full h-full object-cover brightness-75 group-hover:brightness-50 transition duration-500"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                <h3 className="text-3xl font-bold drop-shadow-lg uppercase tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-lg mt-2 opacity-90">Shop Now →</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fallback */}
      {categories.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No categories available yet. Please check back soon.
        </div>
      )}
    </div>
  );
}
