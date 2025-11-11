import React from "react";
import { useNavigate } from "react-router-dom";
import { ref, set, remove } from "firebase/database";
import { database } from "../../firebase/firebase";

export default function ProductCard({ product, wishlist = [], userId }) {
  const navigate = useNavigate();

  const isWishlisted = wishlist?.some((p) => p.id === product.id);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!userId) {
      alert("Please login to use wishlist!");
      return;
    }

    const productRef = ref(database, `wishlists/${userId}/${product.id}`);

    try {
      if (isWishlisted) {
        await remove(productRef);
        alert("Removed from wishlist ❤️‍🔥");
      } else {
        await set(productRef, product);
        alert("Added to wishlist 💖");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/user/product/${product.id}`)}
    >
      <img
        src={product.image || "/no-image.jpg"}
        alt={product.name}
        className="w-full h-60 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="font-semibold text-pink-600">₹{product.price}</div>
          <button
            onClick={toggleWishlist}
            className={`text-xl ${
              isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
