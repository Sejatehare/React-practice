import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCategories, fetchProducts } from "../../api/dbAPI";
import StarRating from "./StarRating";

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const navigate = useNavigate();

  const defaultImages = {
    rings:
      "https://png.pngtree.com/thumb_back/fh260/background/20230715/pngtree-d-rendering-of-a-glossy-background-featuring-a-two-diamond-gold-image_3867619.jpg",
    necklace:
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed",
    earrings:
      "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw9aded0fd/images/hi-res/515090DAEAGA00_1.jpg",
    bracelets:
      "https://images.unsplash.com/photo-1612214086305-7e8a9c9dc65c",
    payal:
      "https://www.newsx.com/wp-content/uploads/2025/07/242.jpg",
    bangles:
      "https://images.unsplash.com/photo-1622396483592-89bdfb0f5983",
    watches:
      "https://images.unsplash.com/photo-1612817159949-46e7f77d7b4d",
  };

  const fallbackImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    "https://images.unsplash.com/photo-1616401784845-180b1b037c3b",
    "https://images.unsplash.com/photo-1599649094882-17fa6b6a44db",
    "https://images.unsplash.com/photo-1612214086305-7e8a9c9dc65c",
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

  useEffect(() => {
    (async () => {
      try {
        const products = await fetchProducts();

        const ranked = products
          .filter(p => p.rating) // only rated products
          .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return (b.ratingCount || 0) - (a.ratingCount || 0);
          })
          .slice(0, 4);

        setBestSellers(ranked);
      } catch (err) {
        console.error("Failed to load best sellers:", err);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[80vh] rounded-3xl overflow-hidden mb-20 shadow-xl">
        <img
          src="https://i.pinimg.com/736x/db/08/ac/db08ac5800b059e978a553befb885b62.jpg"
          alt="Luxury Jewelry"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wide">
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl max-w-xl mb-8 opacity-90">
            Discover handcrafted jewelry made to shine with you
          </p>

          <div className="flex gap-4">
            <Link
              to="/user/products"
              className="bg-pink-500 hover:bg-pink-600 px-8 py-3 rounded-full text-lg font-semibold transition"
            >
              Shop Now
            </Link>
            <Link
              to="/user/wishlist"
              className="border border-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition"
            >
              Wishlist
            </Link>
          </div>
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      <h2 className="text-3xl font-bold text-center mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {categories.map((cat, index) => {
          const image =
            defaultImages[cat.name] ||
            fallbackImages[index % fallbackImages.length];

          return (
            <div
              key={cat.id}
              className="relative group h-[60vh] rounded-2xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition duration-500"
              onClick={() =>
                navigate(
                  `/user/products?category=${encodeURIComponent(cat.name)}`
                )
              }
            >
              <img
                src={cat.image || image}
                alt={cat.name}
                className="w-full h-full object-cover brightness-75 group-hover:brightness-50 transition"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-3xl font-bold uppercase tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-lg mt-2">Shop Now →</p>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No categories available yet.
        </div>
      )}

      {/* ================= BEST SELLERS ================= */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Best Sellers
        </h2>

        {bestSellers.length === 0 ? (
          <p className="text-center text-gray-500">
            No top-rated products yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {bestSellers.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate(`/user/product/${prod.id}`)}
                className="relative card p-4 fade-up hover:shadow-xl transition cursor-pointer group"
              >
                {/* 🔥 Badge */}
                <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-3 py-1 rounded-full">
                  Best Seller
                </span>

                <img
                  src={prod.image || "/no-image.jpg"}
                  alt={prod.name}
                  className="h-52 w-full object-cover rounded-xl mb-4 group-hover:scale-105 transition"
                />

                <h3 className="font-semibold text-lg truncate">
                  {prod.name}
                </h3>

                {/* ⭐ Rating */}
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={prod.rating} />
                  <span className="text-sm text-gray-500">
                    ({prod.ratingCount || 0})
                  </span>
                </div>

                <p className="text-pink-500 font-bold mt-1">
                  ₹{prod.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/product/${prod.id}`);
                  }}
                  className="mt-4 w-full bg-pink-500 text-white py-2 rounded-full hover:bg-pink-600 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* ================= TRUST SECTION ================= */}
      <div className="mt-28 bg-gray-50 rounded-3xl py-14 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <h3 className="text-3xl font-bold text-pink-500">10k+</h3>
            <p className="text-gray-600 mt-2">Happy Customers</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-pink-500">100%</h3>
            <p className="text-gray-600 mt-2">Certified Gold</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-pink-500">Secure</h3>
            <p className="text-gray-600 mt-2">Razorpay Payments</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-pink-500">7 Days</h3>
            <p className="text-gray-600 mt-2">Easy Returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
