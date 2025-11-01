// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const navItems = [
    { name: "Home", to: "/user/home" },
    { name: "Products", to: "/user/products" },
    { name: "Orders", to: "/user/orders" },
    { name: "Profile", to: "/user/profile" },
    { name: "About", to: "/user/about" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <nav className="bg-yellow-50 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <Link to="/user/home" className="text-xl font-bold text-gray-800">
              HOUSE OF SHRINGAR
            </Link>
            <div className="text-sm text-gray-500">Fine Jewelry</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-2 py-1 hover:text-pink-500 ${
                  pathname === n.to ? "text-pink-500 font-semibold" : "text-gray-700"
                }`}
              >
                {n.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 hidden sm:block">{user.email}</div>
            <button
              onClick={() => navigate("/user/cart")}
              className="bg-pink-500 text-white px-3 py-1 rounded"
            >
              Cart
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
