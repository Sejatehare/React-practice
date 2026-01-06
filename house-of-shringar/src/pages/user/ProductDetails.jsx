// src/pages/user/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../api/dbAPI";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    (async () => {
      const all = await fetchProducts();
      const found = all.find((p) => p.id === id);
      if (!found) return navigate("/user/products");
      setProduct(found);
    })();
  }, [id, navigate]);

  if (!product) return <div className="p-6">Loading...</div>;

  const handleAdd = () => {
    dispatch(addToCart({ ...product, id: product.id, price: Number(product.price) }));
    navigate("/user/cart");
  };

  return (
    <div className="max-w-4xl mx-auto card p-4 fade-up mt-6">
      <div className="md:flex gap-6">
        <div className="md:w-1/2">
          <img src={product.image || "/no-image.jpg"} alt={product.name} className="w-full h-96 object-cover rounded" />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600 my-2">{product.category}</p>
          <p className="text-xl font-semibold text-pink-600">₹{product.price}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={handleAdd} className="bg-pink-500 text-white px-4 py-2 rounded">Add to Cart</button>
            <button onClick={() => navigate(-1)} className="bg-gray-200 px-4 py-2 rounded">Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
