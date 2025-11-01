// src/pages/user/CheckoutPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../api/dbAPI";

export default function CheckoutPage() {
  const { items, total } = useSelector((state) => state.cart);
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resolveUid = (user) => user?.uid || user?.userId || user?.id || null;

  const handlePlaceOrder = async () => {
    if (!items?.length) {
      alert("🛒 Your cart is empty!");
      return;
    }
    if (!address.trim()) {
      alert("📦 Please enter address.");
      return;
    }

    const orderData = {
      userId: resolveUid(storedUser) || "guest",
      userEmail: storedUser?.email || "unknown",
      items: items.map(it => ({ id: it.id, name: it.name, price: it.price, qty: it.qty || it.quantity || 1 })),
      totalAmount: total,
      status: "Pending",
      paymentMethod,
      address,
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = await placeOrder(orderData);
      console.log("Order saved:", saved);
      alert("✅ Order placed!");
      dispatch(clearCart());
      navigate("/user/orders");
    } catch (err) {
      console.error("Place order failed:", err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Checkout</h1>
      <div className="bg-gray-100 rounded-lg p-6 shadow space-y-4">
        <div>
          <label className="block font-medium mb-1">Delivery address</label>
          <textarea value={address} onChange={(e)=>setAddress(e.target.value)} className="w-full border rounded p-2" rows="3" />
        </div>
        <div>
          <label className="block font-medium mb-1">Payment method</label>
          <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className="w-full border rounded p-2">
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>
        <div className="text-lg font-semibold">Total: ₹{total}</div>
        <button onClick={handlePlaceOrder} className="bg-green-600 text-white px-6 py-3 rounded w-full">Place Order</button>
      </div>
    </div>
  );
}
