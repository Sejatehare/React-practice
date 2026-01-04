// src/pages/user/CheckoutPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../api/dbAPI";
import { loadRazorpay } from "../../utils/razorpay";

export default function CheckoutPage() {
  const { items, total } = useSelector((state) => state.cart);
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resolveUid = (user) =>
    user?.uid || user?.userId || user?.id || "guest";

  const buildOrderData = (extra = {}) => ({
    userId: resolveUid(storedUser),
    userEmail: storedUser?.email || "unknown",
    items: items.map((it) => ({
      id: it.id,
      name: it.name,
      image: it.image || "/no-image.jpg",
      price: it.price,
      qty: it.qty || it.quantity || 1,
    })),
    totalAmount: total,
    address,
    paymentMethod,
    createdAt: new Date().toISOString(),
    ...extra,
  });

  const saveOrderAndFinish = async (orderData) => {
    await placeOrder(orderData);
    dispatch(clearCart());
    navigate("/user/orders");
  };

  const handleCOD = async () => {
    setLoading(true);
    try {
      await saveOrderAndFinish(
        buildOrderData({
          status: "Pending",
          paymentStatus: "COD",
        })
      );
      alert("✅ Order placed (COD)");
    } catch (err) {
      alert("❌ Order failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: total * 100,
      currency: "INR",
      name: "My Store",
      description: "Order Payment",

      handler: async function (response) {
        try {
          await saveOrderAndFinish(
            buildOrderData({
              status: "Pending",          // ✅ NOT Paid
              paymentStatus: "Success",   // ✅ payment info here
              paymentId: response.razorpay_payment_id,
            })
          );
          alert("🎉 Payment successful");
        } catch {
          alert("❌ Order save failed after payment");
        }
      },

      prefill: {
        name: storedUser?.name || "User",
        email: storedUser?.email,
      },

      theme: { color: "#16a34a" },

      modal: {
        ondismiss: () => {
          alert("❌ Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = () => {
    if (!items?.length) return alert("🛒 Cart is empty");
    if (!address.trim()) return alert("📦 Address required");

    if (paymentMethod === "COD") handleCOD();
    else handleRazorpay();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Checkout</h1>

      <div className="bg-gray-100 rounded-lg p-6 shadow space-y-4">
        <div>
          <label className="block font-medium mb-1">Delivery address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Payment method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI / Card</option>
          </select>
        </div>

        <div className="text-lg font-semibold">Total: ₹{total}</div>

        <button
          disabled={loading}
          onClick={handlePlaceOrder}
          className="bg-green-600 text-white px-6 py-3 rounded w-full disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
