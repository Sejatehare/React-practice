// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, createProduct } from "../../store/productSlice";
import { fetchCategories } from "../../api/dbAPI";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { items = [] } = useSelector((s) => s.products);

  const [categories, setCategories] = useState([]);
  const [newP, setNewP] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    dispatch(getProducts());
    (async () => {
      try {
        const c = await fetchCategories();
        setCategories(c);
      } catch (e) {
        console.error("Error fetching categories", e);
      }
    })();
  }, [dispatch]);

  const handleAdd = () => {
    if (!newP.name || !newP.price || !newP.category)
      return alert("Name, category and price are required");

    dispatch(createProduct({ ...newP, price: Number(newP.price) }));
    setNewP({ name: "", category: "", price: "", image: "", description: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      {/* Add Product Section */}
      <div className="bg-white p-4 rounded mb-6 shadow">
        <h3 className="font-semibold mb-2">Add Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            placeholder="Name"
            value={newP.name}
            onChange={(e) => setNewP({ ...newP, name: e.target.value })}
            className="border p-2 rounded"
          />

          {/* Category dropdown */}
          <select
            value={newP.category}
            onChange={(e) => setNewP({ ...newP, category: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Price"
            value={newP.price}
            onChange={(e) => setNewP({ ...newP, price: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Image URL"
            value={newP.image}
            onChange={(e) => setNewP({ ...newP, image: e.target.value })}
            className="border p-2 rounded"
          />
        </div>

        <textarea
          placeholder="Description"
          value={newP.description}
          onChange={(e) => setNewP({ ...newP, description: e.target.value })}
          className="w-full mt-2 border p-2 rounded"
        />

        <div className="mt-3 flex justify-between items-center">
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
          <Link
            to="/admin/categories"
            className="text-blue-600 hover:underline"
          >
            Manage Categories
          </Link>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded shadow">
            <img
              src={p.image || "/no-image.jpg"}
              alt={p.name}
              className="w-full h-50 object-cover rounded"
            />
            <h4 className="font-semibold mt-2">{p.name}</h4>
            <div className="text-sm text-gray-600">{p.category}</div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-pink-600 font-semibold">₹{p.price}</div>
              <Link
                to={`/admin/product/${p.id}`}
                className="text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
