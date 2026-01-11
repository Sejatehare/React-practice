import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";
import ProductCard from "../../components/user/ProductCard";

export default function WishlistPage() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user?.userId) return;
    const wishRef = ref(database, `wishlists/${user.userId}`);
    const un = onValue(wishRef, (snap) => {
      const data = snap.val();
      if (!data) return setWishlist([]);
      setWishlist(Object.values(data));
    });
    return () => un();
  }, [user.userId]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Wishlist 💖</h2>
      {wishlist.length === 0 ? (
        <p>No wishlisted products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              userId={user.userId}
              wishlist={wishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
