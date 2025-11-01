// src/pages/admin/AdminOrders.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, setOrder } from "../../store/orderSlice";

const STATUS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { items: orders = [], loading } = useSelector(s => s.orders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleChange = (id, newStatus) => {
    const orderToUpdate = orders.find(o => o.id === id);
    if (!orderToUpdate) return;
    const updated = { ...orderToUpdate, status: newStatus };
    dispatch(setOrder({ id, data: updated }));
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">Order #{o.id}</div>
              <div className="text-sm text-gray-500">{o.userEmail} • {o.items?.length || 0} items</div>
            </div>
            <div className="flex items-center gap-3">
              <select value={o.status || "Pending"} onChange={(e)=>handleChange(o.id, e.target.value)} className="border p-1 rounded">
                {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
