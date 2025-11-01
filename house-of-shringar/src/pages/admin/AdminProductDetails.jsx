// src/pages/admin/AdminProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  editProduct,
  removeProduct,
  getProducts,
} from "../../store/productSlice";
import { fetchCategories } from "../../api/dbAPI";

export default function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.products);
  const product = items.find((p) => p.id === id);

  const [form, setForm] = useState(product || {});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!product) dispatch(getProducts());
    else setForm(product);

    (async () => {
      try {
        const c = await fetchCategories();
        setCategories(c);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    })();
  }, [product, dispatch]);

  if (!form) return <div className="p-6">Loading...</div>;

  const handleSave = () => {
    if (!form.name || !form.price || !form.category)
      return alert("Name, category, and price are required");

    dispatch(editProduct({ id, data: { ...form, price: Number(form.price) } }));
    alert("Saved successfully!");
    navigate("/admin");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(removeProduct(id));
      navigate("/admin");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

      <label className="block mb-2 font-medium">Product Name</label>
      <input
        className="w-full border p-2 mb-4 rounded"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <label className="block mb-2 font-medium">Category</label>
      <select
        className="w-full border p-2 mb-4 rounded"
        value={form.category || ""}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Price</label>
      <input
        className="w-full border p-2 mb-4 rounded"
        type="number"
        value={form.price || ""}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <label className="block mb-2 font-medium">Image URL</label>
      <input
        className="w-full border p-2 mb-4 rounded"
        value={form.image || ""}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      <label className="block mb-2 font-medium">Description</label>
      <textarea
        className="w-full border p-2 mb-4 rounded"
        value={form.description || ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
