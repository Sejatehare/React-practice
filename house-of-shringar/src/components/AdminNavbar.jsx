import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-semibold">Admin Panel</div>
        <div className="flex gap-4">
          <Link to="/admin" className="hover:text-pink-400">Products</Link>
          <Link to="/admin/orders" className="hover:text-pink-400">Orders</Link>
          <Link to="/admin/profile" className="hover:text-pink-400">Profile</Link>
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
        </div>
      </div>
    </nav>
  );
}
