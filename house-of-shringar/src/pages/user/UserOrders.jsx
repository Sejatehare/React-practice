import React, { useEffect, useState } from "react";
import { onValue, ref, off } from "firebase/database";
import { database } from "../../firebase/firebase";
import RatingModal from "../../components/user/RatingModal";
import {
  fetchProducts,
  submitProductRating,
  markOrderItemRated,
} from "../../api/dbAPI";
import jsPDF from "jspdf";

/* ================= ORDER MODAL ================= */
function OrderModal({ order, onClose, productsMap, onRateClick }) {
  const [customerPhone, setCustomerPhone] = useState("");
  const [adminPhone, setAdminPhone] = useState("");

  useEffect(() => {
    if (!order?.userId) return;

    const userRef = ref(database, `users/${order.userId}`);
    const adminRef = ref(database, "adminProfile");

    onValue(userRef, (snap) => {
      if (snap.exists()) {
        setCustomerPhone(snap.val().phone || "");
      }
    });

    onValue(adminRef, (snap) => {
      if (snap.exists()) {
        setAdminPhone(snap.val().phone || "");
      }
    });

    return () => {
      off(userRef);
      off(adminRef);
    };
  }, [order]);

  if (!order) return null;

  const isPaymentDone =
    order.paymentMethod !== "COD" || order.status === "Delivered";

  const generateInvoicePDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("INVOICE", 14, 20);

    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order.id}`, 14, 35);
    pdf.text(`Payment: ${order.paymentMethod}`, 14, 45);
    pdf.text(`Status: ${order.status}`, 14, 55);

    let y = 70;
    pdf.text("Items:", 14, y);
    y += 10;

    order.items?.forEach((item) => {
      pdf.text(
        `${item.name} (${item.qty} × ₹${item.price}) = ₹${
          item.qty * item.price
        }`,
        14,
        y
      );
      y += 8;
    });

    y += 10;
    pdf.setFontSize(14);
    pdf.text(`Total: ₹${order.totalAmount}`, 14, y);

    return pdf;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Order #{order.id}</h3>
          <button onClick={onClose} className="text-red-600 font-semibold">
            Close
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div><b>Status:</b> {order.status}</div>
          <div><b>Payment:</b> {order.paymentMethod}</div>
          <div><b>Address:</b> {order.address}</div>

          <h4 className="font-semibold mt-4">Items</h4>

          {order.items?.map((it) => (
            <div
              key={it.id}
              className="flex gap-4 border rounded p-2 hover:bg-gray-50"
            >
              <img
                src={
                  productsMap[it.id]?.image ||
                  it.image ||
                  "/no-image.jpg"
                }
                className="w-20 h-20 object-cover rounded"
                alt={it.name}
              />

              <div className="flex-1">
                <div className="font-semibold">{it.name}</div>
                <div className="text-gray-500">
                  ₹{it.price} × {it.qty}
                </div>

                {order.status === "Delivered" && !it.rated && (
                  <button
                    onClick={() => onRateClick(order.id, it.id)}
                    className="mt-2 text-sm text-pink-600 underline"
                  >
                    Rate this product
                  </button>
                )}
              </div>

              <div className="font-semibold">
                ₹{it.price * it.qty}
              </div>
            </div>
          ))}

          <div className="mt-4 font-semibold text-lg">
            Total: ₹{order.totalAmount}
          </div>

          {isPaymentDone ? (
            <button
              onClick={() => {
                const pdf = generateInvoicePDF();
                pdf.save(`Invoice_${order.id}.pdf`);
              }}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded font-semibold"
            >
              📥 Download Invoice
            </button>
          ) : (
            <button
              disabled
              className="mt-4 w-full bg-gray-300 text-gray-600 py-2 rounded"
            >
              Invoice available after payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= USER ORDERS ================= */
export default function UserOrders() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const uid =
    storedUser.uid ||
    storedUser.userId ||
    storedUser.id ||
    storedUser.email?.replace(".", "_") ||
    null;

  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* Load products */
  useEffect(() => {
    (async () => {
      const prods = await fetchProducts();
      const map = {};
      prods.forEach((p) => (map[p.id] = p));
      setProductsMap(map);
    })();
  }, []);

  /* Load orders */
  useEffect(() => {
    if (!uid) return;

    const ordersRef = ref(database, "orders");

    onValue(ordersRef, (snap) => {
      const data = snap.val();
      if (!data) {
        setOrders([]);
        return;
      }

      const list = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .filter((o) => o.userId === uid)
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

      setOrders(list);

      const delivered = list.find(
        (o) => o.status === "Delivered" &&
          o.items?.some((i) => !i.rated)
      );

      if (delivered) {
        const item = delivered.items.find((i) => !i.rated);
        setSelectedProduct({
          orderId: delivered.id,
          productId: item.id,
        });
      }
    });

    return () => off(ordersRef);
  }, [uid]);

  const handleRatingSubmit = async (rating) => {
    await submitProductRating(
      selectedProduct.productId,
      rating
    );
    await markOrderItemRated(
      selectedProduct.orderId,
      selectedProduct.productId
    );
    setSelectedProduct(null);
  };

  if (!uid) {
    return (
      <div className="p-6 text-red-600">
        Login required
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        My Orders
      </h2>

      {orders.length === 0 && (
        <div className="text-gray-500">
          No orders found
        </div>
      )}

      {orders.map((o) => (
        <div
          key={o.id}
          className="bg-white p-4 rounded shadow mb-4 flex items-center justify-between gap-4"
        >
          {/* LEFT */}
          <div>
            <div className="font-semibold">
              Order #{o.id}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(o.createdAt).toLocaleString()}
            </div>
          </div>

          {/* MIDDLE – IMAGES */}
          <div className="flex gap-2">
            {o.items?.slice(0, 3).map((item) => (
              <img
                key={item.id}
                src={item.image || "/no-image.jpg"}
                className="w-12 h-12 rounded object-cover border"
                alt={item.name}
              />
            ))}
            {o.items?.length > 3 && (
              <span className="text-sm text-gray-500">
                +{o.items.length - 3}
              </span>
            )}
          </div>

          {/* RIGHT */}
          <div className="text-right">
            <div className="font-semibold mb-1">
              ₹{o.totalAmount}
            </div>
            <button
              onClick={() => setSelectedOrder(o)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              View Details
            </button>
          </div>
        </div>
      ))}

      <OrderModal
        order={selectedOrder}
        productsMap={productsMap}
        onClose={() => setSelectedOrder(null)}
        onRateClick={(orderId, productId) =>
          setSelectedProduct({ orderId, productId })
        }
      />

      {selectedProduct && (
        <RatingModal
          onClose={() => setSelectedProduct(null)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}
