import React, { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";

export default function AdminAddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const catRef = ref(database, "categories");
    const unsubscribe = onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((id) => ({
          id,
          name: data[id].name,
        }));
        setCategories(list);
      } else {
        setCategories([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) {
      alert("⚠️ Please fill all required fields!");
      return;
    }
    try {
      await push(ref(database, "products"), {
        name,
        price: parseFloat(price),
        desc,
        image,
        category,
        createdAt: new Date().toISOString(),
      });
      alert("✅ Product added successfully!");
      setName("");
      setPrice("");
      setDesc("");
      setImage("");
      setCategory("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>

      <form onSubmit={handleAdd} className="space-y-4 card p-4 fade-up shadow">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          className="border p-2 rounded w-full"
          rows="3"
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="border p-2 rounded w-full"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
