// src/pages/admin/AdminOrders.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, setOrder } from "../../store/orderSlice";

const STATUS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { items: orders = [], loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleChange = (id, newStatus) => {
    const orderToUpdate = orders.find((o) => o.id === id);
    if (!orderToUpdate) return;
    const updated = { ...orderToUpdate, status: newStatus };
    dispatch(setOrder({ id, data: updated }));
  };

  if (loading) return <div className="p-6 text-center text-lg">Loading orders...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-3">
        📦 Orders Management
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No orders available.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              {/* 🧾 Order Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-3 mb-5">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.userEmail || "Unknown user"} •{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  <label className="text-sm font-semibold text-gray-600">
                    Status:
                  </label>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => handleChange(order.id, e.target.value)}
                    className="border p-2 rounded-md text-sm focus:ring-2 focus:ring-pink-400"
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 🛍️ Order Items */}
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-4 border-b pb-3 last:border-none"
                  >
                    <img
                      src={item.image || "/no-image.jpg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                      <p className="text-sm text-gray-600">
                        Price: ₹{item.price} x {item.qty} ={" "}
                        <span className="font-semibold text-gray-800">
                          ₹{item.price * item.qty}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 💳 Order Summary */}
              <div className="mt-5 bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  <strong>Total Amount:</strong>{" "}
                  <span className="text-pink-600 font-semibold text-base">
                    ₹{order.totalAmount || "N/A"}
                  </span>
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMethod || "Not specified"}
                </p>
                <p>
                  <strong>Delivery Address:</strong>{" "}
                  {order.address || "No address provided"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
