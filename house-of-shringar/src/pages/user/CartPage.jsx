// src/pages/user/CartPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQty, removeFromCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, total } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!items.length) return <div className="p-6 text-center">Cart is empty</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-4 card p-4 fade-up">
            <img src={it.image || "/no-image.jpg"} alt={it.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{it.name}</h3>
              <p className="text-sm text-gray-500">₹{it.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={it.qty}
                onChange={(e) => dispatch(updateQty({ id: it.id, qty: Number(e.target.value) }))}
                className="w-20 border rounded p-1"
              />
              <button onClick={() => dispatch(removeFromCart(it.id))} className="text-red-500">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <div className="text-lg font-semibold mb-2">Total: ₹{total}</div>
        <button onClick={() => navigate("/user/checkout")} className="bg-green-600 text-white px-4 py-2 rounded">Proceed to Checkout</button>
      </div>
    </div>
  );
}
