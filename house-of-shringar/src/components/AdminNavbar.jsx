import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const navItemClass = (path) =>
    `px-3 py-1 rounded transition ${
      pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-xl">
      <div className="w-full px-6 py-3 flex justify-between items-center">
        
        {/* TITLE */}
        <div className="text-lg font-bold tracking-wide text-white">
          Admin Panel
        </div>

        {/* LINKS */}
        <div className="flex gap-4 items-center">
          <Link to="/admin" className={navItemClass("/admin")}>
            Products
          </Link>
          <Link to="/admin/orders" className={navItemClass("/admin/orders")}>
            Orders
          </Link>
          <Link to="/admin/profile" className={navItemClass("/admin/profile")}>
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="ml-2 bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
