import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, update, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const productRef = ref(database, `products/${id}`);
    onValue(productRef, (snapshot) => {
      setProduct(snapshot.val());
    });

    const catRef = ref(database, "categories");
    onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((id) => ({
          id,
          name: data[id].name,
        }));
        setCategories(list);
      }
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!product.name.trim() || !product.price || !product.category) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    try {
      await update(ref(database, `products/${id}`), product);
      alert("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product!");
    }
  };

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Product Name"
          required
        />
        <input
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Price"
          required
        />
        <textarea
          value={product.desc}
          onChange={(e) => setProduct({ ...product, desc: e.target.value })}
          className="border p-2 rounded w-full"
          rows="3"
          placeholder="Description"
        />
        <input
          value={product.image}
          onChange={(e) => setProduct({ ...product, image: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Image URL"
        />

        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
