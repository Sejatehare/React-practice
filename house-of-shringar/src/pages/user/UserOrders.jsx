// src/pages/user/UserOrders.jsx
import React, { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase/firebase";
import { fetchProducts } from "../../api/dbAPI";
import { useNavigate } from "react-router-dom";

function OrderModal({ order, onClose, productsMap }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl overflow-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Order #{order.id}</h3>
          <button onClick={onClose} className="text-red-600">Close</button>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</div>
          <div className="text-sm"><b>Status:</b> {order.status}</div>
          <div className="text-sm"><b>Payment:</b> {order.paymentMethod}</div>
          <div className="text-sm"><b>Address:</b> {order.address}</div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="space-y-2">
              {order.items?.map((it) => {
                const prod = productsMap[it.id];
                return (
                  <div key={it.id} className="flex items-center gap-4 border rounded p-2">
                    <img src={prod?.image || it.image || "/no-image.jpg"} alt={it.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-semibold">{it.name || prod?.name}</div>
                      <div className="text-sm text-gray-500">₹{it.price} × {it.qty}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">₹{(it.price || prod?.price || 0) * (it.qty || 1)}</div>
                      <div className="mt-2">
                        <a href={`/user/product/${it.id}`} className="text-blue-600 underline">View Product</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 font-semibold">Total: ₹{order.totalAmount}</div>
        </div>
      </div>
    </div>
  );
}

export default function UserOrders() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const uid = storedUser?.uid || storedUser?.userId || storedUser?.id || null;

  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // load all products once so we can show images & links in modal
    (async () => {
      try {
        const prods = await fetchProducts();
        const map = {};
        prods.forEach(p => (map[p.id] = p));
        setProductsMap(map);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!uid) return setOrders([]);

    const ordersRef = ref(database, "orders");
    const unsubscribe = onValue(ordersRef, (snap) => {
      const data = snap.val();
      if (!data) {
        setOrders([]);
        return;
      }
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      const myOrders = list.filter(o => o.userId === uid).sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(myOrders);
    });

    return () => unsubscribe();
  }, [uid]);

  if (!uid) {
    return (
      <div className="p-6">
        <div className="text-red-600">You must be logged in to view your orders.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-4 rounded shadow flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="font-semibold">Order #{o.id}</div>
                <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="mt-2 text-sm">
                  {o.items?.slice(0, 2).map(it => <span key={it.id}>{it.name} × {it.qty} &nbsp;</span>)}
                  {o.items?.length > 2 && <span className="text-gray-500">and {o.items.length - 2} more</span>}
                </div>
              </div>

              <div className="text-right">
                <div className="mb-2 font-semibold">₹{o.totalAmount}</div>
                <div className={`mb-2 px-3 py-1 rounded ${o.status === "Delivered" ? "bg-green-100 text-green-700" : o.status === "Shipped" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {o.status}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setSelectedOrder(o)} className="bg-blue-600 text-white px-3 py-1 rounded">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} productsMap={productsMap} />
    </div>
  );
}
